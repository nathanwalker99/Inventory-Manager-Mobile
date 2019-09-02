import React, { Component } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { ScrollView } from "react-native-gesture-handler";
import { _retrieveData } from "../../utilities/_retrieveData"
import { similarity } from "./sortUtilities/similarity";
import { similarityNum } from "./sortUtilities/similarityNum";
import { mergeSortSimilarity } from "./sortUtilities/mergeSortSimilarity";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";
import { removeFromArray } from "../../utilities/removeFromArray";

export class SearchScreen extends Component {
    static navigationOptions = {
      title: "Search"
    }
  
    constructor(props) {
      super(props);
      this.state = {
        currentInventory: { id:"", name: "", removed: [ ], data:[[]]},
        textInputs: [ ],
      }
      const { navigation } = this.props
      this.navigation = navigation
      this.isUnmounted = false
    }
  
    async componentDidMount() {
      await this._detectInventoryUpdate().catch(parseAndHandleErrors)
    }
  
    componentWillUnmount() {
      this.isUnmounted = true
      clearTimeout(this.timeout);
    }
  
    _detectInventoryUpdate = async (reset = false) => {
      const currentInventory = JSON.parse(await _retrieveData("current_inventory"));
      if (currentInventory.id !== this.state.currentInventory.id || currentInventory.removed.length < this.state.currentInventory.removed.length) {
        const textInputs = this._createTextInputState(currentInventory.data);
        let location;
        if (currentInventory.removed.length < this.state.currentInventory.removed.length) {
          location = "Edit";
        } else {
          location = "Inventories";
        }
        this.setState({ currentInventory, textInputs });
        if (reset) {
          const resetAction = StackActions.reset({
            index: 0,
            key: "Search",
            actions: [NavigationActions.navigate({ routeName: 'SearchScreen' })],
          });
          this.navigation.dispatch(resetAction);
          this.navigation.navigate(location);
        }
      }
      if (JSON.stringify(currentInventory.removed) !== JSON.stringify(this.state.currentInventory.removed)) {
        const newInventory = removeFromArray(this.state.currentInventory.data, currentInventory.removed[currentInventory.removed.length-1]);
        this.setState({ currentInventory: { id: currentInventory.id, name: currentInventory.name, removed: currentInventory.removed, data: newInventory}});
      }
      if (!this.isUnmounted) {
        this.timeout = setTimeout(() => this._detectInventoryUpdate(true), 200);
      }
    }
  
    sortInventory = () => {
      const attributeArray = this.state.currentInventory.data[0]
      const textArray = this.state.textInputs.map((item) => {
        return item.text
      })
      const parsedText = textArray.map((text) => {
        if (text == "") return text
        if (!isNaN(text)) return JSON.stringify(parseFloat(text))
        return text
      })
      const currInventory = this.state.currentInventory.data.slice(1);
      const parsedInventory = currInventory.map((row) => {
        return row.map((text) => {
          if (text == "") return text
          if (!isNaN(text)) return JSON.stringify(parseFloat(text));
          return text
        })
      })
      let similarityArray = [ ];
      for (let i = 0; i < parsedInventory.length; i++) {
        let total = 0;
        for (let j = 0; j < parsedText.length; j++) {
          if (!isNaN(parsedText[j]) && !isNaN(parsedInventory[i][j]) && parsedText[j] !== "" && parsedInventory[i][j] !== "") {
            total = total + similarityNum(parseFloat(parsedText[j]), parseFloat(parsedInventory[i][j]));
          } else {
            total = total + similarity(parsedText[j], parsedInventory[i][j]);
          }
        }
        similarityArray.push({total: total, index: i});
      }
      const sortedSimilarity = mergeSortSimilarity(similarityArray);
      sortedSimilarity.reverse();
      let sortedInventory = new Array(sortedSimilarity.length+1);
      sortedInventory[0] = attributeArray.slice(0);
      for (let i = 1; i < sortedSimilarity.length+1; i++) {
        const index = sortedSimilarity[i-1].index;
        sortedInventory[i] = currInventory[index];
      }
      return { sortedInventory, sortedSimilarity };
    }
  
    _createTextInputState = (data) => {
      return data[0].map((item) => {
        return {attribute: item, text: ""}
      })
    }
  
    _onChangeText = (text, key) => {
      this.setState((previousState) => ({
        textInputs: previousState.textInputs.map((item) => {
          if (item.attribute == key) {
            return ({attribute: key, text: text})
          }
          return item
        })
      }))
    }
  
    _onPress = () => {
      const originalInventory = this.state.currentInventory.data.slice(0);
      const removed = this.state.currentInventory.removed.slice(0);
      const sortInventory = this.sortInventory();
      const name = this.state.currentInventory.name;
      const id = this.state.currentInventory.id;
      this.navigation.navigate('Results', { originalInventory, sortInventory, name, removed, id });
    }
  
    renderTextInputs = () => {
      return this.state.textInputs.map((item) => {
        return (
          <TextInput
          style={{width:250, height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this._onChangeText(text, item.attribute)}
          placeholder={`Enter a value for ${item.attribute}`}
          value={item.text}
          autoCapitalize="none"
          autoCorrect={false}
          key={item.attribute}/>
        )
      })
    }
  
    render() {
      if (this.state.currentInventory.name == "") {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Set a current inventory in the Inventories tab</Text>
            <Text>to use the Search feature.</Text>
          </View>
        )
      }
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}></View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView>
              {this.renderTextInputs()}
            </ScrollView>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <Button
              title={"Search"}
              onPress={this._onPress}/>
          </View>
        </View>
      )
    }
  }