import React, { Component } from "react";
import { _storeData } from "../../utilities/_storeData";
import { _retrieveData } from "../../utilities/_retrieveData";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";
import { sleep } from "../../utilities/sleep";
import { View, Button} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export class InventoriesScreen extends Component {
    static navigationOptions = {
      title: "Inventories"
    }
  
    constructor(props) {
      super(props);
      this.state = {
        inventories: [ ],
        buttons: { }
      }
    }
  
    async componentDidMount() {
      await _storeData("current_inventory", JSON.stringify({id: "", name: "", removed: [ ], data: [[]]}))
      await _storeData("inventories", JSON.stringify([ ]))
      await this._detectInventoryUpdate().catch(parseAndHandleErrors)
    }
  
    componentWillUnmount() {
      this.isUnmounted = true;
      clearTimeout(this.timeout);
    }
  
    _detectInventoryUpdate = async () => {
      const currentInventory = JSON.parse(await _retrieveData("current_inventory"));
      const inventories = JSON.parse(await _retrieveData("inventories"));
      const id = currentInventory.id;
      let index = null;
      for (let i = 0; i < this.state.inventories.length; i++) {
        if (this.state.inventories[i].id == id) {
          index = i;
          break
        }
      }
      if (index !== null) {
        if (JSON.stringify(currentInventory.data) !== JSON.stringify(this.state.inventories[index].data)) {
          let newInventories = this.state.inventories;
          newInventories[index] = currentInventory;
          this.setState({ inventories: newInventories });
          await _storeData("inventories", JSON.stringify(newInventories));
        }
      }
      if (inventories.length !== this.state.inventories.length) {
        if (inventories.length > 0 && inventories[inventories.length - 1] == "update") {
          inventories.pop();
        }
        const buttons = this._createButtonsState(inventories);
        this.setState({ inventories, buttons })
      }
  
      if (!this.isUnmounted) {
        this.timeout = setTimeout(() => this._detectInventoryUpdate(), 200);
      }
    }
  
    _onPress = async (navigation, inventory) => {
      try {
        let state = this.state;
        state.buttons[inventory.id] = {disabled: true, title: "Loading"};
        this.setState(state)
        async function navigate() {
          await sleep(1000);
          navigation.navigate("Preview", { inventory });
        }
        await navigate();
        state.buttons[inventory.id] = { disabled: false, title: inventory.name };
        this.setState(state);
      } catch {
        const buttons = this._createButtonsState(this.state.inventories);
        this.setState({ buttons });
      }
    }
  
    _createButtonsState = (inventories) => {
      let buttons = { }
      inventories.forEach((item) => {
        buttons[item.id] = { };
        buttons[item.id].disabled = false;
        buttons[item.id].title = item.name
      })
      return buttons
    }
  
    renderButtons = (navigation) => {
      return this.state.inventories.map((item) => {
        return (<Button
          key={item.name}
          disabled={this.state.buttons[item.id].disabled}
          title={this.state.buttons[item.id].title}
          onPress={async () => await this._onPress(navigation, item)}/>)
      })
    }
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ScrollView>
            {this.renderButtons(this.props.navigation)}
          </ScrollView>
        </View>
      )
    }
  }