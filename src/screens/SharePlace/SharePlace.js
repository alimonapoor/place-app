import React, { Component } from 'react';
import { View, Text , ScrollView , Image , Button , StyleSheet , ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';

import { addPlace } from '../../store/actions/index';
import MainText from '../../components/ui/mainText/mainText'
import HeadingText from '../../components/ui/headingText/headingText'
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import PickImage from '../../components/pickImage/pickImage'
import PickLocation from '../../components/pickLocation/pickLocation'
import validate from '../../utilitys/validation'

class SharePlaceScreen extends Component {
    state = {
        controls: {
          placeName: {
            value: "",
            valid: false,
            touched: false,
            validationRules: {
              notEmpty: true
            }
          },
          location: {
            value: null,
            valid: false
          },
          image: {
            value: null,
            valid: false
          }
        }
      }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            } 
        }  
    }

    placeNameChangedHandler = val => {
        this.setState(prevState => {
          return {
            controls: {
              ...prevState.controls,
              placeName: {
                ...prevState.controls.placeName,
                value: val,
                valid: validate(val, prevState.controls.placeName.validationRules),
                touched: true
              }
            }
          };
        });
      };

      locationPickedHandler = location => {
        this.setState(prevState => {
          return {
            controls: {
              ...prevState.controls,
              location: {
                value: location,
                valid: true
              }
            }
          };
        });
      };

      imagePickedHandler = image => {
          this.setState(prevState => {
              return {
                  controls : {
                      ...prevState.controls,
                      image : {
                          value : image,
                          valid : true
                      }
                  }
              }
          })
      }


      placeAddedHandler = () => {
        this.props.onAddPlace(
          this.state.controls.placeName.value,
          this.state.controls.image.value
        )
        this.setState({
            controls : {placeName :{ value: ''},
                        image : { value : ''}}
        })
      };

render () {

  let submitButton = (
    <Button
      title="Share the Place!"
      onPress={this.placeAddedHandler}
      disabled={
        !this.state.controls.placeName.valid ||
        !this.state.controls.image.valid
      }
    />
  )

    if(this.props.isLoading) {
      submitButton = <ActivityIndicator />
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <MainText>
                    <HeadingText>Share a Place with Us!</HeadingText>
                </MainText>
                <PickImage onImagePicked={this.imagePickedHandler} />
                <PickLocation onLocationPick={this.locationPickedHandler}/>
                <PlaceInput 
                    placeData={this.state.controls.placeName.value} 
                    onChangeText={this.placeNameChangedHandler}/>
                <View style={styles.button}>{submitButton}</View>
            </View> 
        </ScrollView>
        );
    }
}

const mapStateToProps = state => {
  return {
    isLoading : state.ui.isLoading
  }
}

const mapDispatchToProps = dispatch => {
    return {
        onAddPlace: (placeName , image) => dispatch(addPlace(placeName, image))
    };
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
    },
    button : {
        margin : 8
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);