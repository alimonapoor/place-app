import React, { Component } from 'react'
import { 
        View, 
        ImageBackground , 
        Dimensions , 
        StyleSheet,
        KeyboardAvoidingView,
        Keyboard,
        TouchableWithoutFeedback 
    } from 'react-native'
   
import { connect } from 'react-redux'    

import startMainTabs from '../MainTabs/startMainTabs'
import DefaultInput from '../../components/ui/default-input/defaultInput'
import HeadingText from '../../components/ui/headingText/headingText'
import MainText from '../../components/ui/mainText/mainText'
import BackgroundImage from '../../assets/background.jpg' 
import ButtonWithBackground from '../../components/ui/buttonWithBackgroud/buttonWithBackground'
import validate from '../../utilitys/validation'
import { tryAuth } from '../../store/actions/index'


class AuthScreen extends Component {

    state = {
        viewMode : Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
        authMode : 'login',
        controls : {
            email : {
                value : '',
                valid : false,
                validationRules : {
                    isEmail : true
                },
                touched : false
            },
        password: {
            value : '',
            valid : false,
            validationRules : {
                minLength : 6
            },
            touched :false
        },
        confirmPassword : {
            value : '',
            valid : false,
            validationRules : {
                equalTo : 'password'
            },
            touched :false
            }
        }
    }

constructor(props) {
    super(props)
    Dimensions.addEventListener('change' , this.updateStyles)
}

    componentWillUnmount() {
        Dimensions.removeEventListener('change' , this.updateStyles)
    }

    updateStyles = (dims) => {
        this.setState({
            viewMode : 
            dims.window.height > 500 ? 'portrait' : 'landscape'
        })
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                authMode : prevState.authMode === "login" ? "signup" : 'login'
            }
        })
    }

    loginHandler = () => {
        const authData = {
            email : this.state.controls.email.value,
            password : this.state.controls.password.value
        }
        this.props.onLogin(authData)
        startMainTabs()
    }

    updateInputState = (key , value) => {
        let connectedValue = {}
        if(this.state.controls[key].validationRules.equalTo)
        {
            const equalControl = this.state.controls[key].validationRules.equalTo
            const equalValue = this.state.controls[equalControl].value
            connectedValue = {
                ...connectedValue,
                equalTo : equalValue
            }
        }
        if(key === 'password') {
            connectedValue = {
                ...connectedValue,
                equalTo : value
            }
        }
        this.setState(prevState => {
            return {
                controls : {
                    ...prevState.controls,
                    confirmPassword : {
                        ...prevState.controls.confirmPassword,
                        valid : 
                            key === 'password'
                            ? validate(
                                prevState.controls.confirmPassword.value,
                                prevState.controls.confirmPassword.validationRules,
                                connectedValue
                            )
                            : prevState.controls.confirmPassword.valid
                    },
                    [key] : {
                        ...prevState.controls[key],
                        value : value,
                        valid : validate(
                            value,
                            prevState.controls[key].validationRules,
                            connectedValue
                        ),
                        touched : true
                    }
                }
            }
        })
    } 

    render () {
        let headingText = null
        let confirmPasswordControl = null

        if(this.state.viewMode === "portrait") {
            headingText = (
                <MainText style={styles.mainText}>
                    <HeadingText>Please LogIn</HeadingText>
                </MainText>
            )
        }

        if(this.state.authMode === 'signup') {
            confirmPasswordControl = (
            <View
                style={
                    this.state.viewMode === "portrait"
                    ? styles.portraitPassworWrapper
                    : styles.landscapePassworWrapper
                }
            >    
                <DefaultInput 
                    placeholder="Confirm Password" 
                    style={styles.input}
                    value={this.state.controls.confirmPassword.value}
                    onChangeText={val => this.updateInputState('confirmPassword', val)}
                    valid={this.state.controls.confirmPassword.valid}
                    touched={this.state.controls.confirmPassword.touched}
                    secureTextEntry
                    />
            </View>
            )
        }

        return (
            <ImageBackground source={BackgroundImage} style={styles.BackgroundImage} >
                <KeyboardAvoidingView style={styles.container} behavior="padding" >
                    {headingText}
                    <ButtonWithBackground
                            onPress={this.switchAuthModeHandler} 
                            color="#29aaf4"
                    >
                        Switch to {this.state.authMode === 'login' ? 'Sign Up' : 'Login'}
                    </ButtonWithBackground>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inputContainer}>
                        <DefaultInput 
                            placeholder="Your Email Address" 
                            style={styles.input}
                            value={this.state.controls.email.value}
                            onChangeText={val => this.updateInputState('email' , val)}
                            valid={this.state.controls.email.valid}
                            touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            KeyboardType="email-address"
                        />
                        <View 
                            style={
                                this.state.viewMode === "portrait" ||
                                this.state.authMode === 'login'
                                ? styles.portraitPassworContainer
                                : styles.landscapePassworContainer
                            }
                        >    
                        <View
                            style={
                                this.state.viewMode === "portrait" ||
                                this.state.authMode === 'login'
                                ? styles.portraitPassworWrapper
                                : styles.landscapePassworWrapper
                            }
                        >    
                            <DefaultInput 
                                placeholder="Password" 
                                style={styles.input}
                                value={this.state.controls.password.value}
                                onChangeText={val => this.updateInputState('password', val)}
                                valid={this.state.controls.password.valid}
                                touched={this.state.controls.password.touched}
                                secureTextEntry
                                />
                        </View>
                            {confirmPasswordControl}
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                    <ButtonWithBackground 
                        color="#29aaf4" 
                        onPress={this.loginHandler}
                        disabled={
                            !this.state.controls.confirmPassword.valid && this.state.authMode === 'signup' ||
                            !this.state.controls.email.valid ||
                            !this.state.controls.password.valid
                        }
                        >
                        Submit
                    </ButtonWithBackground>
                </KeyboardAvoidingView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    BackgroundImage : {
        width : '100%',
        flex : 1
    },
    inputContainer : {
        width : '80%'
    },
    input : {
        backgroundColor : '#eee',
        borderColor : '#bbb'
    },
    mainText : {
        marginBottom : 10
    },
    landscapePassworContainer : {
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    portraitPassworContainer : {
        flexDirection : 'column',
        justifyContent : 'flex-start'
    },
    landscapePassworWrapper : {
        width : '45%'
    },
    portraitPassworWrapper : {
        width : '100%'
    }
})

const mapDispatchToProps = dispatch => {
    return {
        onLogin : authData => dispatch(tryAuth(authData))
    }
}

export default connect(null, mapDispatchToProps)(AuthScreen)