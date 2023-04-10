
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import axios from 'axios';
import notifee, {AndroidImportance, EventType, TimestampTrigger, TriggerType} from '@notifee/react-native';







const TASK_NAME = "MY_TASK"


TaskManager.defineTask(TASK_NAME, () => {
  try {
    const receivedNewData ="Random: " + Math.random();
    console.log(receivedNewData);
    
    return receivedNewData ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    return BackgroundFetch.Result.Failed;
  }
});

const register = () => {
    return BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumFetchInterval: 2,
        stopOnTerminate: false,
        startOnBoot: true
    })
}

const unregister = () => {
    return BackgroundFetch.unregisterTaskAsync(TASK_NAME)
}






///////////////////////////-----------------------------------------------------


const backgroundFetch = async () => {
  const response = await axios.get('http://192.168.13.212:1213/todos/projetoautomacaodemo/cenas/apireact/status.sala.api.php');
  const updates = response.data;

  console.log("campainha primeiro segundo ")
  console.log(updates)

  if (updates.length > 0) {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: '20',
      name: 'sales',
      vibration: true,
      importance: AndroidImportance.HIGH

    });

    await notifee.displayNotification({
      id: '10',
      title: 'Atenção',
      body: 'segundo plano',
      android:  {channelId}
    });




  }

  return  response ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
 
};
















export default {
    register,
    unregister,
  backgroundFetch
   
    
}

