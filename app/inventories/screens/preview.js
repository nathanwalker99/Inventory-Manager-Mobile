import React, { Component } from "react";
import { _storeData } from "../../utilities/_storeData";
import { _retrieveData } from "../../utilities/_retrieveData";
import { styles } from "../../utilities/styles";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors"
import { View, Text, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export class PreviewScreen extends Component {
    static navigationOptions = {
      title: "View"
    }
  
    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.navigation = navigation
      const inventory = this.navigation.getParam("inventory", "Error")
      this.scrollRef = React.createRef();
      this.state = {
        inventory,
        buttonTitle: "Set to Current Inventory",
        buttonDisabled: false,
        scrollIndex: 0
      }
    }
  
    async componentDidMount() {
      const isCurrInventory = await this.detectCurrInventory();
      if (!isCurrInventory) {
        const buttonTitle = "Set to Current Inventory";
        const buttonDisabled = false;
        this.setState({ buttonTitle, buttonDisabled })
      } else {
        const buttonTitle = "Set as Current Inventory";
        const buttonDisabled = true;
        this.setState({ buttonTitle, buttonDisabled })
      } 
      await this._detectInventoryUpdate().catch(parseAndHandleErrors)
    }
  
    componentWillUnmount() {
      this.isUnmounted = true
      clearTimeout(this.timeout);
    }
  
    _detectInventoryUpdate = async () => {
      const currentInventory = JSON.parse(await _retrieveData("current_inventory"));
      if (currentInventory.name == this.state.inventory.name && JSON.stringify(currentInventory.data) !== JSON.stringify(this.state.inventory.data)) {
        this.setState({ inventory: currentInventory });
      }
      if (!this.isUnmounted) {
        this.timeout = setTimeout(() => this._detectInventoryUpdate(true), 200);
      }
    }
  
    _onPress = async () => {
      await _storeData("current_inventory", JSON.stringify(this.state.inventory));
      this.setState({
        buttonTitle: "Set as Current Inventory",
        buttonDisabled: true
      })
    }
  
    increaseScrollIndex = () => {
      this.setState(previousState => ({ scrollIndex: previousState.scrollIndex+100 }))
      this.scrollRef.current.scrollTo({x: 0, y: 0, animated: true })
    }
  
    decreaseScrollIndex = () => {
      this.setState(previousState => ({ scrollIndex: previousState.scrollIndex-100 }))
      this.scrollRef.current.scrollTo({x: 0, y: 0, animated: true })
    }
  
    detectCurrInventory = async () => {
      const currInventory = JSON.parse(await _retrieveData("current_inventory"));
      if (currInventory.id == this.state.inventory.id) return true
      return false
    }
  
    renderInventory = () => {
      const attributes = this.state.inventory.data[0];
      const inventory = this.state.inventory.data.slice(1 + this.state.scrollIndex);
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
  
    renderLoadPreviousButton = () => {
      if (this.state.scrollIndex !== 0) {
        return <Button title={"Load Previous"} onPress={this.decreaseScrollIndex}/>
      }
    }
  
    renderLoadMoreButton = () => {
      const loadedInventory = this.state.inventory.data.slice(1 + this.state.scrollIndex);
      if (loadedInventory.length > 100) {
        return <Button title={"Load More"} onPress={this.increaseScrollIndex}/>
      }
    }
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.titleText}>{this.state.inventory.name}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <Button
              title={this.state.buttonTitle}
              disabled={this.state.buttonDisabled}
              onPress={async () => await this._onPress()}/>
          </View>
          <View style={{flex:4, width:"90%", alignItems: 'center', justifyContent: 'center'}}>
            <ScrollView ref={this.scrollRef}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                  {this.renderLoadPreviousButton()}
              </View>
              <ScrollView ref={this.scrollRef} horizontal={true} contentContainerStyle={{flexGrow:1}}>
                <View style={{ flex: 3, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around' }}>
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