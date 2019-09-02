import React, { Component } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { _retrieveData } from "../../utilities/_retrieveData";
import { _storeData } from "../../utilities/_storeData";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";
import { styles } from "../../utilities/styles";

export class RestoreItemsScreen extends Component {
    static navigationOptions = {
      title: "Results",
    }
  
    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.navigation = navigation;
      const currInventory = this.navigation.getParam("currInventory", "Error");
      this.scrollRef = React.createRef();
      this.state = {
        currInventory,
        scrollIndex: 0,
      };
    }
  
    async componentDidMount() {
      await this._detectInventoryUpdate().catch(parseAndHandleErrors)
    }
  
    componentWillUnmount() {
      clearTimeout(this.timeout);
      this.isUnmounted = true
    }
  
    _detectInventoryUpdate = async () => {
      const currentInventory = JSON.parse(await _retrieveData("current_inventory"));
      if (JSON.stringify(currentInventory.removed) !== JSON.stringify(this.state.currInventory.removed)) {
        this.setState({ currInventory: currentInventory });
      }
      if (!this.isUnmounted) {
        this.timeout = setTimeout(() => this._detectInventoryUpdate(), 200);
      }
    }
  
    _onPress = async (index) => {
      const removed = this.state.currInventory.removed.slice(0);
      const restoredItem = removed.splice(index, 1);
      const oldData = this.state.currInventory.data.slice(0);
      const data = oldData.concat(restoredItem);
      const name = this.state.currInventory.name;
      const id = this.state.currInventory.id;
      await _storeData("current_inventory", JSON.stringify({ id, name, data, removed }));
    }
  
    renderInventory = () => {
      const attributes = this.state.currInventory.data[0];
      const inventory = this.state.currInventory.removed.slice(0 + this.state.scrollIndex);
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
  
    increaseScrollIndex = () => {
      this.setState(previousState => ({ scrollIndex: previousState.scrollIndex+100 }))
      this.scrollRef.current.scrollTo({x: 0, y: 0, animated: true })
    }
  
    decreaseScrollIndex = () => {
      this.setState(previousState => ({ scrollIndex: previousState.scrollIndex-100 }))
      this.scrollRef.current.scrollTo({x: 0, y: 0, animated: true })
    }
  
    renderLoadPreviousButton = () => {
      if (this.state.scrollIndex !== 0) {
        return <Button title={"Load Previous"} onPress={this.decreaseScrollIndex}/>
      }
    }
  
    renderLoadMoreButton = () => {
      const loadedInventory = this.state.currInventory.removed.slice(0 + this.state.scrollIndex);
      if (loadedInventory.length > 100) {
        return <Button title={"Load More"} onPress={this.increaseScrollIndex}/>
      }
    }
  
    renderButtons = () => {
      const inventory = this.state.currInventory.removed.slice(0 + this.state.scrollIndex);
      const buttonsArray = Array(inventory.length);
      let colLength;
      if (inventory.length > 100) {
        colLength = 100;
      } else {
        colLength = inventory.length;
      }
      for (let i = 0; i < colLength; i++) {
        buttonsArray[i] = <TouchableOpacity key={`${i}`} style={styles.buttonBorder} onPress={async () => await this._onPress(i)}>
        <Text style={styles.buttonText}>{"Restore"}</Text>
        </TouchableOpacity>;
      }
      return buttonsArray;
    }
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.titleText}>{this.state.name}</Text>
          </View>
          <View style={{flex:4, alignItems: 'center', justifyContent: 'center'}}>
            <ScrollView ref={this.scrollRef}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                  {this.renderLoadPreviousButton()}
              </View>
              <ScrollView ref={this.scrollRef} horizontal={true} contentContainerStyle={{flexGrow:1}}>
                <View style={{ flex: 3, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                  {this.renderButtons()}
                  </View>
                  {this.renderInventory()}
                </View>
              </ScrollView>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                  {this.renderLoadMoreButton()}
              </View>
            </ScrollView>
          </View>
        </View>
      )
    }
  }