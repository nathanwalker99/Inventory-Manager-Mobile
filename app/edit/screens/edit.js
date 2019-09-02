import React, { Component } from "react";
import { View, Text, Button,  Alert } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { _retrieveData } from "../../utilities/_retrieveData";
import { _storeData } from "../../utilities/_storeData";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";
import { styles } from "../../utilities/styles";

export class EditScreen extends Component {
    static navigationOptions = {
      title: "Edit"
    }
  
    constructor(props) {
      super(props);
      this.state = {
        currentInventory: { id: "", name: "", removed: [ ], data:[[]]},
      }
      const { navigation } = this.props
      this.navigation = navigation
      this.isUnmounted = false
    }
  
    async componentDidMount() {
      await this._detectInventoryUpdate().catch(parseAndHandleErrors)
    }
  
    componentWillUnmount() {
      clearTimeout(this.timeout);
      this.isUnmounted = true
    }
  
    _detectInventoryUpdate = async (reset = false) => {
      const currentInventory = JSON.parse(await _retrieveData("current_inventory"));
      if (currentInventory.id !== this.state.currentInventory.id) {
        this.setState({ currentInventory });
        if (reset) {
          const resetAction = StackActions.reset({
            index: 0,
            key: "Edit",
            actions: [NavigationActions.navigate({ routeName: 'EditScreen' })],
          });
          this.navigation.dispatch(resetAction);
          this.navigation.navigate("Inventories");
        }
      }
      if (JSON.stringify(currentInventory.data) !== JSON.stringify(this.state.currentInventory.data)) {
        this.setState({ currentInventory });
      }
      if (!this.isUnmounted) {
        this.timeout = setTimeout(() => this._detectInventoryUpdate(true), 200);
      }
    }
  
    deleteInventory = async () => {
      let inventories = JSON.parse(await _retrieveData("inventories"));
      for (let i = 0; i < inventories.length; i++) {
        if (inventories[i].id == this.state.currentInventory.id) {
          inventories.splice(i, 1);
        }
      }
      await _storeData("inventories", JSON.stringify(inventories));
      await _storeData("current_inventory", JSON.stringify({ id: "", name: "", removed: [ ], data:[[]]}));
    }
  
    _onPressRemoveAlert = () => {
      Alert.alert(
        'Are you sure that you want to delete this inventory?',
        'This action cannot be undone.',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Accept', onPress: async () => {await this.deleteInventory()}},
        ],
        {cancelable: false},
      );
    }
  
    _onPressRestore = () => {
      const currInventory = this.state.currentInventory;
      this.navigation.navigate('RestoreItems', { currInventory });
    }
  
    render() {
      if (this.state.currentInventory.name == "") {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Set a current inventory in the Inventories tab</Text>
            <Text>to use the Edit feature.</Text>
          </View>
        )
      }
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.titleText}>{this.state.currentInventory.name}</Text>
          </View>
          <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
            <Button
              title={"Add Item (Not Currently Implemented)"}/>
            <Text>{" "}</Text>
            <Button
              title={"Restore Items"}
              onPress={this._onPressRestore}/>
            <Text>{" "}</Text>
            <Button
              title={"Delete Inventory"}
              onPress={this._onPressRemoveAlert}/>
          </View>
        </View>
      )
    }
  }