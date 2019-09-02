import React, { Component } from "react";
import { View, Text, Button, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { _retrieveData } from "../../utilities/_retrieveData"
import { _storeData } from "../../utilities/_storeData"
import { styles } from "../../utilities/styles";

export class EditItemScreen extends Component {
    static navigationOptions = {
      title: "Edit Entry"
    }
  
    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.navigation = navigation;
      const originalInventory = this.navigation.getParam("originalInventory", "Error");
      const originalIndex = this.navigation.getParam("originalIndex", "Error");
      const removed = this.navigation.getParam("removed", "Error");
      const name = this.navigation.getParam("name", "Error");
      const id = this.navigation.getParam("id", "Error");
      this.state = {
        originalInventory,
        originalIndex,
        removed,
        name,
        id
      };
    }
  
    _onPressEdit = () => {
  
    }
  
    _onPressRemoveAlert = () => {
      Alert.alert(
        'Are you sure that you want to remove this entry?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Accept', onPress: async () => {await this._onPressRemove()}},
        ],
        {cancelable: false},
      );
    }
  
    _onPressRemove = async () => {
      let data = this.state.originalInventory.slice(0);
      const removedRow = data.splice(this.state.originalIndex + 1, 1);
      let removed = this.state.removed;
      removed.push(removedRow[0]);
      const name = this.state.name;
      const id = this.state.id;
      await _storeData("current_inventory", JSON.stringify({ name, removed, data, id }))
      this.navigation.pop();
    }
  
    renderRow = () => {
      const attributes = this.state.originalInventory[0];
      const row = this.state.originalInventory[this.state.originalIndex + 1];
      let renderRow = Array(attributes.length);
      for (let i = 0; i < attributes.length; i++) {
        const col = <Text key={`${i}`} style={styles.tableText}>{`${attributes[i]}: ${row[i]}`}</Text>
        renderRow[i] = <View key={`${i}`} style={{flex:1, flexDirection: 'column'}}>{col}</View>
      }
      return renderRow
    }
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          </View>
          <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <ScrollView>
              <ScrollView horizontal={true} contentContainerStyle={{flexGrow:1}}>
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                  {this.renderRow()}
                </View>
              </ScrollView>
            </ScrollView>
          </View>
          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Button title={"Edit Data (Not Currently Implemented)"} onPress={this._onPressEdit}/>
            <Text>{" "}</Text>
            <Button title={"Remove Entry"} onPress={async () => await this._onPressRemoveAlert()}/>
          </View>
        </View>
      )
    }
  }