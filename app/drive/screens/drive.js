import React, { Component } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { _retrieveData } from "../../utilities/_retrieveData";
import { _storeData } from "../../utilities/_storeData";
import { sleep } from "../../utilities/sleep";
import { setupExists } from "../driveUtilities/setupExists";
import { createSetup } from "../driveUtilities/createSetup";
import { getFileId } from "../driveUtilities/getFileId";
import { fileExists } from "../driveUtilities/fileExists";
import { createSheet } from "../driveUtilities/createSheet";
import { addParentRemoveRoot } from "../driveUtilities/addParentRemoveRoot";
import { downloadAllInventories } from "../driveUtilities/downloadAllInventories";

export class DriveScreen extends Component {
    static navigationOptions = {
      title: "Drive"
    }
  
    constructor(props) {
      super(props);
      this.state = {
        isSigninInProgress: false,
        userInfo: null,
        signInError: "",
        text: "",
        createButtonText: "Create Inventory",
        createButtonDisabled: false,
        downLoadButtonText: "View Inventories in Google Drive",
        downloadButtonDisabled: false,
        inventories: [ ]
      }
      this.configureGoogle()
    }
  
    configureGoogle = () => {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.file'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '586487622900-lbmsd4bf0h1r2fvcaf09s8rmcqfr588h.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: '', // specifies a hosted domain restriction
        loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
        accountName: '', // [Android] specifies an account name on the device that should be used
        iosClientId: '586487622900-t1rlmmfs8a6cm3p4tb1nin8e9jasgmsl.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });
    }
  
    
    _signIn = async () => {
      try {
        let isSigninInProgress = true
        this.setState({ isSigninInProgress })
        await GoogleSignin.hasPlayServices();
        //await GoogleSignin.revokeAccess();
        //await GoogleSignin.signOut();
        const userInfo = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        const accessToken = tokens.accessToken
        existingSetup = await setupExists(accessToken)
        if (!existingSetup) {
          await createSetup(accessToken)
        }
        this.setState( { userInfo })
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (f.e. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          this.setState( { signInError: "Play services are not enabled on your device." })
        } else {
          // some other error happened
          this.setState( { signInError: "An error has occurred. Please try signing in again." })
        }
      }
      let isSigninInProgress = false
      this.setState({ isSigninInProgress })
    };
  
    _createInventory = async (title) => {
      let interval;
      try{
        if (title == "") {
          this.setState({ 
            createButtonText: "You must enter a name for your inventory.",
            createButtonDisabled: true
          })
          await sleep(3000)
          this.setState( { createButtonText: "Create Inventory", createButtonDisabled: false })
        } else if (title == "inventories" || title == "inventory_manager_mobile_data" || title == "backups"){
          this.setState({ 
            createButtonText: "You cannot use that name.",
            createButtonDisabled: true
          })
          await sleep(3000)
          this.setState( { createButtonText: "Create Inventory", createButtonDisabled: false })
        } else{
          this.setState({ createButtonDisabled: true })
          interval = setInterval(() => {
            if (this.state.createButtonText == "Creating Inventory....."){
              this.setState({ createButtonText: "Creating Inventory." })
            } else if (this.state.createButtonText == "Create Inventory"){
            this.setState({ createButtonText: "Creating Inventory."})
            } else {
              this.setState(previousState => (
                { createButtonText: `${previousState.createButtonText}.` }
              ))
            }
            }, 200);
          const tokens = await GoogleSignin.getTokens();
          const accessToken = tokens.accessToken;
          const inventoriesFolderId = await getFileId(accessToken, "inventories");
          const fileAlreadyExists = await fileExists(accessToken, title, inventoriesFolderId)
          if (fileAlreadyExists) {
            clearInterval(interval);
            this.setState({ createButtonText: "An inventory with that name already exists." })
          } else {
            const spreadsheetId = await createSheet(title, accessToken);
            await addParentRemoveRoot(spreadsheetId, inventoriesFolderId, accessToken)
            clearInterval(interval)
            this.setState( { createButtonText: "Created Inventory!" });
          }
          await sleep(3000)
          this.setState( { createButtonText: "Create Inventory", createButtonDisabled: false })
        }
      } catch (error) {
        clearInterval(interval)
        this.setState({ 
          createButtonText: "An error has occured. Please try again.",
          createButtonDisabled: true
        })
        await sleep(3000)
        this.setState( { createButtonText: "Create Inventory", createButtonDisabled: false })
      }
  
    }
  
    _downloadInventories = async (navigation) => {
      let interval;
      try {
        this.setState({ downloadButtonDisabled: true })
        interval = setInterval(() => {
          if (this.state.downLoadButtonText == "Loading....."){
            this.setState({ downLoadButtonText: "Loading." })
          } else if (this.state.downLoadButtonText == "View Inventories in Google Drive"){
          this.setState({ downLoadButtonText: "Loading."})
          } else {
            this.setState(previousState => (
              { downLoadButtonText: `${previousState.downLoadButtonText}.` }
            ))
          }
          }, 200);
        const tokens = await GoogleSignin.getTokens();
        const accessToken = tokens.accessToken;
        const inventories = await downloadAllInventories(accessToken);
        navigation.navigate("DriveInventories", { inventories });
        clearInterval(interval);
        this.setState({ downloadButtonDisabled: false, downLoadButtonText: "View Inventories in Google Drive" });
      } catch {
        clearInterval(interval);
        this.setState({ downloadButtonDisabled: false, downLoadButtonText: "View Inventories in Google Drive" });
      }
    }
  
    render() {
      if (this.state.userInfo == null) {
        return(
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <GoogleSigninButton
              style={{ width: 192, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this._signIn}
              disabled={this.state.isSigninInProgress} />
            <Text>{this.state.signInError}</Text>
          </View>
        )
      } else {
        return(
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flex:1, alignItems: "center", justifyContent: "center"}}>
              <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={this._signIn}
                disabled={this.state.isSigninInProgress} />
              <Text>{`Signed in as ${this.state.userInfo.user.email}`}</Text>
            </View>
            <View style={{ flex:1, flexDirection: "column", alignItems: "center", justifyContent: "flex-start"}}>
              <TextInput
                style={{width:220, height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({text})}
                placeholder="Enter a name for a new inventory."
                value={this.state.text}
                autoCapitalize="none"
                autoCorrect={false}/>
              <Button
                title={this.state.createButtonText}
                onPress={async () => this._createInventory(this.state.text)}
                disabled={this.state.createButtonDisabled}/>
              <Text>{" "}</Text>
              <Button
                title={this.state.downLoadButtonText}
                onPress={async () => this._downloadInventories(this.props.navigation)}
                disabled={this.state.downloadButtonDisabled}/>
              <Text>{" "}</Text>
              <Button
                title={"Sign Out"}/>
            </View>
  
          </View>
        )
      }
    }
  }