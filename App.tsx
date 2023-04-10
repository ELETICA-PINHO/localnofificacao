import { Text, View , Button,AppState,} from 'react-native';
import {styles} from './styles';
import notifee, {AndroidImportance, EventType, TimestampTrigger, TriggerType} from '@notifee/react-native';
import { useEffect, useInsertionEffect, useState,useRef } from 'react';
import MyTask from './services/MyTask';
import axios from 'axios';





export default function App() {

  const [lista, setlista] = useState([]);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const registerMyTask = () => {
    MyTask.register()
    .then( ()=> console.log("task Resgister"))
    .catch (error =>console.log(error))
  }




  useEffect(() =>{

    

    //---------------------------------------------------------

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });


    check_banco();

    return () => {
      subscription.remove();
    };

   

  })


   
if(appState.current == "background"){

  registerMyTask();

}


  




  
  async function campainha(){

    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: '10',
      name: 'sales',
      vibration: true,
      importance: AndroidImportance.HIGH

    });

    await notifee.displayNotification({
      id: '10',
      title: 'Atenção',
      body: 'Tem alguém no portão',
      android:  {channelId}
    });

  }





const backgroundFetch = () => {
  MyTask.register()
  .then( ()=> console.log("task notificação"))
  .catch (error =>console.log(error))
}





 async function check_banco() {

  const res = await axios.get('http://192.168.13.212:1213/todos/projetoautomacaodemo/cenas/apireact/status.sala.api.php')
  setlista(res.data);


  console.log("passou");


  

  const intervalId = setInterval(check_banco, 30000);
 

  if(res.data == "RELE01ON"){
    campainha();
    console.log("campainha primeiro plano");
    }
   return () => clearInterval(intervalId);
 }


  async function createChannelId(){
    const channelId = await notifee.createChannel({
      id: 'teste',
      name: 'sales',
      vibration: true,
      importance:AndroidImportance.HIGH

    });

    return channelId

  }

  
  async function displayNofification(){

    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'teste',
      name: 'sales',
      vibration: true,
      importance: AndroidImportance.HIGH

    });

    await notifee.displayNotification({
      id: '4',
      title: 'Olá Ale',
      body: 'teste',
      android:  {channelId}
    });

  }
  
  useEffect (() => {
    return notifee.onForegroundEvent(({type ,detail}) => {
      switch(type){
        case EventType.DISMISSED:
          console.log("usuario descartou notificação");
          break;

          case EventType.ACTION_PRESS:
          console.log("usuario tocou notificação", detail.notification);
          break;
      }
    });
  },[]);


  useEffect (() => {
    return notifee.onBackgroundEvent( async ({type ,detail}) => {
      if(type === EventType.PRESS){
        console.log("usuario tocou notificação", detail.notification);
      }
    });
  },[]);

  async function upadateNotificacao() {
    await notifee.requestPermission();

    const channelId = await createChannelId();
    await notifee.displayNotification({
      id: '4',
      title: 'Olá Alessandro',
      body: 'teste',
      android:  {channelId}


    })
    
  }

  async function scheduleNotification(){
   const date = new Date(Date.now()); 
   date.setMinutes(date.getMinutes() + 1);

   
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime()
    }

    const channelId = await createChannelId();

    await notifee.createTriggerNotification({
      title: 'notificação agendada',
      body: 'relogio',
      android: {
        channelId
      },
    }, trigger);

  }


   function  lisscheduleNotification() {
    notifee.getTriggerNotificationIds().then(ids => console.log(ids));
    
  }

//----------------------teste---------------------------------------------------------------


  
  return (
    <View style={styles.container}>
      <Text>local notificação  </Text>
      <Button title='notificação' onPress={displayNofification}/>
      <Button title=' atualizar notificação' onPress={upadateNotificacao}/>
      <Text>local notificação  </Text>
      <Button title='agendada' onPress={scheduleNotification}/>
      <Button title='listar' onPress={lisscheduleNotification}/>
      <Button title='campainha' onPress={campainha}/>
      <Button title='backgroundFetch' onPress={backgroundFetch}/>
      <Text>executando : {appStateVisible}</Text>
     
      
    
    </View>
  );


 

}
  
