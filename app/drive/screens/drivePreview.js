import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GoogleSignin } from 'react-native-google-signin';
import { _retrieveData } from "../../utilities/_retrieveData";
import { _storeData } from "../../utilities/_storeData";
import { styles } from "../../utilities/styles";
import { downloadSpreadsheet } from "../driveUtilities/downloadSpreadsheet";
import { clearSpreadsheet } from "../driveUtilities/clearSpreadsheet";
import { valuesIntoSheet } from "../driveUtilities/valuesIntoSheet";

export class DrivePreviewScreen extends Component {
    static navigationOptions = {
      title: "View"
    }
  
    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.navigation = navigation
      let inventory = this.navigation.getParam("inventory", "Error");
      inventory.removed = [ ];
      this.state = {
        inventory,
        saveButtonTitle: "Save Inventory Locally",
        saveButtonDisabled: false,
        updateButtonTitle: "Update Drive with Local Changes",
        updateButtonDisabled: true,
      }
    }
  
    async componentDidMount() {
      let storedInventories = JSON.parse(await _retrieveData("inventories", "Error"));
      this.setState({storedInventories})
      const isInStorage = this.detectInStoredInventories(storedInventories);
      this.setState({isInStorage})
      if (!isInStorage) {
        const saveButtonTitle = "Save Inventory Locally";
        const saveButtonDisabled = false;
        const updateButtonDisabled = true;
        this.setState({ saveButtonTitle, saveButtonDisabled, updateButtonDisabled })
      } else {
        const saveButtonTitle = "Inventory Saved Locally";
        const saveButtonDisabled = true;
        updateButtonDisabled = false;
        this.setState({ saveButtonTitle, saveButtonDisabled, updateButtonDisabled })
      } 
    }
  
    detectInStoredInventories = (storedInventories) => {
      let found = false;
      storedInventories.forEach((item) => {
        if (item.id == this.state.inventory.id) {
          found = true;
        }
      })
      return found;
    }
  
    _saveOnPress = async () => {
      let storedInventories = JSON.parse(await _retrieveData("inventories", "Error"));
      storedInventories.push(this.state.inventory);
      await _storeData("inventories", JSON.stringify(storedInventories));
      this.setState({
        saveButtonTitle: "Inventory Saved Locally",
        saveButtonDisabled: true,
        updateButtonDisabled: false,
      })
    }
  
    _updateOnPress = async () => {
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken
      const spreadsheet = await downloadSpreadsheet(accessToken, this.state.inventory.id);
      let values = spreadsheet.values;
      let localInventories = JSON.parse(await _retrieveData("inventories"));
      const currentInventory = JSON.parse(await _retrieveData("current_inventory"));
      let localInventory;
      localInventories.forEach((item) => {
        if (item.id == this.state.inventory.id) {
          localInventory = item;
        }
      })
      localInventory.removed.forEach((item) => {
        for (let i = 0; i < values.length; i++) {
          if (JSON.stringify(item) == JSON.stringify(values[i])) {
            values.splice(i, 1);
          }
        }
      });
      await clearSpreadsheet(accessToken, this.state.inventory.id);
      await valuesIntoSheet(this.state.inventory.id, values, accessToken);
      let inventory = this.state.inventory;
      inventory.removed = [ ];
      inventory.data = values;
      for (let i = 0; i < localInventories.length; i++) {
        if (localInventories[i].id == inventory.id) {
          localInventories[i] = inventory;
          break
        }
      }
      await _storeData("inventories", JSON.stringify(localInventories.concat("update")));
      if (inventory.id == currentInventory.id) {
        await _storeData("current_inventory", JSON.stringify(inventory));
      }
    }
  
    renderInventory = () => {
      const attributes = this.state.inventory.data[0];
      const inventory = this.state.inventory.data.slice(1);
      let colLength;
      if (inventory.length > 100) {
        colLength = 100;
      } else {
        colLength = inventory.length;
      }
      let renderInventory = Array(attributes.length);
      for (let i = 0; i < attributes.length; i++) {
        let col = Array(colLength);
        for (let j = 0; j < colLength; j++) {
          col[j] = <Text key={`${i}${j}`} style={styles.tableText}>{`${attributes[i]}: ${inventory[j][i]}`}</Text>
        }
        renderInventory[i] = <View key={`${i}`} style={{flex:1, flexDirection: 'column'}}>{col}</View>
      }
      return renderInventory
    }
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.titleText}>{this.state.inventory.name}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Button
              title={this.state.saveButtonTitle}
              disabled={this.state.saveButtonDisabled}
              onPress={async () => await this._saveOnPress()}/>
            <Text>{" "}</Text>
            <Button
              title={this.state.updateButtonTitle}
              disabled={this.state.updateButtonDisabled}
              onPress={async () => await this._updateOnPress()}/>
          </View>
          <View style={{flex:4, width:"90%", alignItems: 'flex-start', justifyContent: 'center'}}>
            <ScrollView>
              <ScrollView horizontal={true} contentContainerStyle={{flexGrow:1}}>
                <View style={{ flex: 3, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                  {this.renderInventory()}
                </View>
              </ScrollView>
            </ScrollView>
          </View>
        </View>
      )
    }
  }