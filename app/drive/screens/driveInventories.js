import React, { Component } from "react";
import { View, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { _retrieveData } from "../../utilities/_retrieveData";
import { _storeData } from "../../utilities/_storeData";


export class DriveInventoriesScreen extends Component {
    static navigationOptions = {
      title: "Drive Inventories"
    }
  
    constructor(props) {
      super(props);
      this.navigation = this.props.navigation;
      const inventories = this.navigation.getParam("inventories", "Error");
      this.state = {
        inventories
      }
    }
  
    _onPress = (navigation, inventory) => {
      navigation.navigate('DrivePreview', {
        inventory
      })
    }
  
    renderButtons = (navigation) => {
      return this.state.inventories.map((item) => {
        return (<Button
          key={item.name}
          title={item.name}
          onPress={() => this._onPress(navigation, item)}/>)
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