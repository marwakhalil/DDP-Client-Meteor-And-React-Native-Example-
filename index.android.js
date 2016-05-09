/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    ListView,
    Text,
    View
} from 'react-native';

var DDPClient = require('ddp-client');
var _ = require('lodash');

if (typeof process === 'undefined') process = {};
    process.nextTick = setImmediate;

module.exports = process;

class reactExample extends Component {

    constructor(){
        super();
        this.state = {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => !_.isEqual(row1, row2),
          }),
          loaded: false};
    }

    componentDidMount() {
        var ddpClient = new DDPClient({ url: 'ws://192.168.1.8:3000/websocket' });

        ddpClient.connect(() => { ddpClient.subscribe('friends') });

        // observe the lists collection
        var observer = ddpClient.observe('friends');
        observer.added = () => {
            this.updateRows(_.cloneDeep(_.values(ddpClient.collections.friends)));
        }
        observer.changed = () => {
            this.updateRows(_.cloneDeep(_.values(ddpClient.collections.friends)));
        }
        observer.removed = () => {
            this.updateRows(_.cloneDeep(_.values(ddpClient.collections.friends)));
        }
    }

    updateRows(rows) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(rows),
            loaded: true,
        });
    }

    render() {
      var tag
          if(!this.state.loaded){
              this.componentDidMount(); 
          }else{
          }
          return (
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderFriend}
                style={styles.listView}
              />
          );    
    }

    renderLoadingView() {
        return ( 
            <View style={styles.container}>
                <Text>
                  Loading lists...
                </Text>
            </View>
        );
    }

    renderFriend(friend) {
        return ( 
          <View style={styles.container}>
            <Text style={styles.firstName}>{friend.firstName}</Text> 
            <Text style={styles.lastName}>{friend.lastName}</Text> 
          </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
    },
    firstName: {
        flex: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastName: {
        flex: 5,
        fontSize: 18,
    },
    listView: {
        paddingTop: 20,
        backgroundColor: 'white',
    },
});

AppRegistry.registerComponent('reactExample', () => reactExample);
