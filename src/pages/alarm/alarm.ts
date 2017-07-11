import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { PhoneOptions } from '../../interfaces/user-options';
import { Storage } from '@ionic/storage';

import { ConferenceData } from '../../providers/conference-data';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html'
})
export class AlarmPage {
  switches: PhoneOptions = { switchassigned: '', chargingtime: '', percentagechargednow: '' };
  submitted = false;
  switchedassignedtoalarm: any;
  alarmdata: any = [];
  alarmnotification: any;
  currentswitchesforalarm: any = [];
  showswitchbehaviour: boolean = false;
  alarmtunepath: any = '';
  singlealarmactions: any = [];

  switchonetext: any = 'Switch One';
  switchtwotext: any = 'Switch Two';
  switchthreetext: any = 'Switch Three';
  switchfourtext: any = 'Switch Four';
  switchfivetext: any = 'Switch Five';
  switchsixtext: any = 'Switch Six';
  switchseventext: any = 'Switch Seven';
  switcheighttext: any = 'Switch Eight';

  switch1model: any = 'switch1*ON';
  switch2model: any = 'switch2*ON';
  switch3model: any = 'switch3*ON';
  switch4model: any = 'switch4*ON';
  switch5model: any = 'switch5*ON';
  switch6model: any = 'switch6*ON';
  switch7model: any = 'switch7*ON';
  switch8model: any = 'switch8*ON';

  alarmtime: any;

  step1: boolean = false;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;

  setnewalarm: boolean = false;
  amarmlist: boolean = false;

  durationoffullcharge: any;
  percentageofchargingpresent: any = 10;
  msg: any = '';
  switchasgsaved: boolean = false;
  lasttunefilename: any;
  showalarmlist: boolean = false;
  isanyalarmset: boolean = false;
  
  constructor(public navCtrl: NavController, public userData: UserData, public storage: Storage, public alertCtrl: AlertController, public confData: ConferenceData, private fileChooser: FileChooser, private filePath: FilePath, private localNotifications: LocalNotifications) 
  {
    this.switchedassignedtoalarm = 0;

    this.durationoffullcharge = new Date().toISOString();
    this.alarmtime = new Date().toISOString();
    this.getData();
  }

  newAlarmSet()
  {
    this.currentswitchesforalarm = [];
    this.switchedassignedtoalarm = [];
    this.singlealarmactions = [];
    this.showalarmlist = false;
    
    this.setnewalarm = true;
    this.amarmlist = true; 
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;
    this.step4 = false;
    this.step5 = false;
  }

  backfromstep1()
  {
    this.setnewalarm = false;
    this.amarmlist = false; 
    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.step4 = false;
    this.step5 = false;
  }

  listAlarm()
  {
    this.amarmlist = true;   
    this.showalarmlist = true;

    this.confData.getAlarm().subscribe((data: any) => {
         
         
          this.alarmnotification = data.data;
         
      }); 
  }

  anyalarmset(data: boolean)
  {
    this.isanyalarmset = data;
  }

  deleteAlarm(data: any)
  {
    this.confirmDeleteMsg(data); 
  }

  confirmDeleteMsg(data: any) 
  {
      let alert: any = this.alertCtrl.create({
        title: 'Confirm',
        message: 'Do you realy want to delete this alarm!',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Ok',
            handler: () => {
              
              this.localNotifications.clear(data).then(() => {
                              
              });

              this.localNotifications.cancel(data).then(() => {
                  this.listAlarm();
              });
            }
          }
          
        ]
      });

      
        alert.present();
      
  }

  thisNotificationIsAlarm(data:any)
  {
    let tempdata: any = JSON.parse(data);

    if(tempdata.hasOwnProperty('tune')){
       return true;
    }else
    {
      return false;
    }
  }

  showalarmtime(alarmtime: any)
  {
    let datetime: any = alarmtime;
    let tempdatetimeformsg: any = datetime.replace("T", " ");
    tempdatetimeformsg = tempdatetimeformsg.slice(0, -5);
    return tempdatetimeformsg;
  }

  showListAlarmData(data: any)
  {
    let tempdata: any = JSON.parse(data);

    let datatortn: string = '';
    let tempactions: any;
    tempactions = tempdata.actions;
    
    for(let i=0;i<tempactions.length;i++)
    {
        datatortn = datatortn + tempactions[i].switchname + ' will be turned ' + this.getSwitchStatus(tempactions[i]) + ' \n';
    }

    datatortn = datatortn + ' \n and the tune is \n' + tempdata.tune;

    
    return datatortn;
  }

  getSwitchStatus(simpledata: any)
  {
          if(simpledata.hasOwnProperty('switch1')){
                
                if(simpledata.switch1 == 'ON')
                {
                  return 'ON'
                }

                if(simpledata.switch1 == 'OFF')
                {
                  return 'OFF'
                }
            }

            if(simpledata.hasOwnProperty('switch2')){
               
                if(simpledata.switch2 == 'ON')
                {
                  return 'ON'
                }

                if(simpledata.switch2 == 'OFF')
                {
                  return 'OFF'
                }
            }

            if(simpledata.hasOwnProperty('switch3')){
                if(simpledata.switch3 == 'ON')
                {
                  return 'ON'
                }

                if(simpledata.switch3 == 'OFF')
                {
                  return 'OFF'
                }
            }

            if(simpledata.hasOwnProperty('switch4')){
                if(simpledata.switch4 == 'ON')
                {
                  return 'ON';
                }

                if(simpledata.switch4 == 'OFF')
                {
                  return 'OFF';
                }
            }

            if(simpledata.hasOwnProperty('switch5')){
                if(simpledata.switch5 == 'ON')
                {
                  return 'ON';
                }

                if(simpledata.switch5 == 'OFF')
                {
                  return 'OFF';
                }
            }

            if(simpledata.hasOwnProperty('switch6')){
                if(simpledata.switch6 == 'ON')
                {
                  return 'ON';
                }

                if(simpledata.switch6 == 'OFF')
                {
                  return 'OFF';
                }
            }

            if(simpledata.hasOwnProperty('switch7')){
                if(simpledata.switch7 == 'ON')
                {
                  return 'ON';
                }

                if(simpledata.switch7 == 'OFF')
                {
                  return 'OFF';
                }
            }

            if(simpledata.hasOwnProperty('switch8')){
                if(simpledata.switch8 == 'ON')
                {
                  return 'ON';
                }

                if(simpledata.switch8 == 'OFF')
                {
                  return 'OFF';
                }
            }
  }

  saveSwitchForAlarm()
  {
    if(this.switchedassignedtoalarm != 0 && this.switchedassignedtoalarm != null && this.switchedassignedtoalarm != undefined && this.switchedassignedtoalarm != '')
    {
      this.setnewalarm = true;
      this.amarmlist = true; 
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;  

      let tempswitch: any;
      let i:number;
      console.log(this.switchedassignedtoalarm);
      
      for(i=0;i<this.switchedassignedtoalarm.length;i++)
      {
        tempswitch = this.switchedassignedtoalarm[i].split("*");
        this.currentswitchesforalarm.push({s:tempswitch[0],m:tempswitch[1]});
        this.showswitchbehaviour = true;
      }
    }
    else
    {
      this.showAlertMsg({title:'OOPS',message:'Please select at least one switch!'});
    }  
  }

  showAlertMsg(data: any) 
  {
      let alert: any = this.alertCtrl.create({
        title: data.title,
        message: data.message,
        buttons: [
          
          {
            text: 'Ok',
            handler: () => {
              
            }
          }
        ]
      });

      
        alert.present();
      
  }

  setSwitchBehaviour()
  {
    this.setnewalarm = true;
    this.amarmlist = true; 
    this.step1 = false;
    this.step2 = false;
    this.step3 = true;
    this.step4 = false;
    this.step5 = false;  

    console.log(this.switch1model);
    console.log(this.switch2model);
    console.log(this.switch3model);
  }

  backfromstep2()
  {
    this.currentswitchesforalarm = [];
    this.setnewalarm = true;
    this.amarmlist = true; 
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;
    this.step4 = false;
    this.step5 = false;  
  }

  backfromstep3()
  {
    this.setnewalarm = true;
    this.amarmlist = true; 
    this.step1 = false;
    this.step2 = true;
    this.step3 = false;
    this.step4 = false;
    this.step5 = false;  
  }

  backfromstep4()
  {
    this.setnewalarm = true;
    this.amarmlist = true; 
    this.step1 = false;
    this.step2 = false;
    this.step3 = true;
    this.step4 = false;
    this.step5 = false;  
  }

  backfromstep5()
  {
    this.setnewalarm = true;
    this.amarmlist = true; 
    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.step4 = true;
    this.step5 = false;  
  }

  backfromstep6()
  {
    this.setnewalarm = true;
    this.amarmlist = true; 
    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.step4 = false;
    this.step5 = true;  
  }
  setAlarmTime()
  {
    this.setnewalarm = true;
    this.amarmlist = true; 
    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.step4 = true;
    this.step5 = false;  

    console.log(this.alarmtime);

  }
  

  pickFile()
  {
    this.fileChooser.open().then(uri => this.checkFilePath(uri)).catch(e => alert(e));
  }

  checkFilePath(path: any)
  {    
      this.filePath.resolveNativePath(path).then(filePath => this.setTuneFilePath(filePath)).catch(err => alert(err));

  }

  setTuneFilePath(data: any)
  {
    
    this.alarmtunepath = data;
    let tunefilename: any = this.alarmtunepath;
    tunefilename = tunefilename.split("/"); 
    tunefilename = tunefilename[tunefilename.length-1]; 

    if(tunefilename.indexOf(".mp3") != -1)
    {
      this.lasttunefilename = tunefilename; 

      this.setnewalarm = true;
      this.amarmlist = true; 
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;  

    }
    else
    {
      this.showAlertMsg({title:'OOPS',message:'Please select only mp3 files!'});
    }

  }

  keepLastFile()
  {
    if(this.lasttunefilename != undefined && this.lasttunefilename != null && this.lasttunefilename != '')
    {
      this.setnewalarm = true;
      this.amarmlist = true; 
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;  
    }
    else
    {
      this.showAlertMsg({title:'OOPS',message:'Please select one mp3 files!'});
    }  
  }

  saveAlarm()
  {

    for(let singleswitch = 0;singleswitch<this.currentswitchesforalarm.length;singleswitch++)
    {
      console.log(this.currentswitchesforalarm[singleswitch]);
      this.sortSwitchDataFillOnce(this.currentswitchesforalarm[singleswitch].s,this.currentswitchesforalarm[singleswitch].m);
    }
        

    let tunefilename: any = this.alarmtunepath;
    tunefilename = tunefilename.split("/"); 
    tunefilename = tunefilename[tunefilename.length-1]; 
    let datetime: any = this.alarmtime;
    datetime = datetime.replace("T", " ");
    datetime = datetime.slice(0, -5);
   

    let tempalarm: any;
    tempalarm = {actions:this.singlealarmactions,at:datetime,tune:tunefilename,tunepath:this.alarmtunepath};

    this.alarmdata.push(tempalarm);

    let datetimetemp: any;
    datetimetemp = this.getFormattedDate(new Date(this.alarmtime)); 

   

    let alaramtune:any = '';

    let datatosend = { usersetdatetime: datetime, title: 'Smart Automation' , desciption: 'Alarm at ' + datetime, soundfile: alaramtune, dataoset: tempalarm };
   
   

    this.confData.setAlarm(datatosend).subscribe((data: any) => {
          this.showAlertSuccess();
          console.log(data);
          this.setnewalarm = false;
          this.amarmlist = false; 
          this.step1 = false;
          this.step2 = false;
          this.step3 = false;
          this.step4 = false;
          this.step5 = false;  
      });
  

  }


  sortSwitchData(data: any)
  {
     let tempdata: any;     
     if(data == 'switch1')
     {
        tempdata = this.switch1model.split("*");
        
        return tempdata[1];
        
     }

     if(data == 'switch2')
     {
        tempdata = this.switch2model.split("*");
        
        
        return tempdata[1];
     }

     if(data == 'switch3')
     {
        tempdata = this.switch3model.split("*");
        
        return tempdata[1];
     }

     if(data == 'switch4')
     {
        tempdata = this.switch4model.split("*");
        
        return tempdata[1];
     }

     if(data == 'switch5')
     {
        tempdata = this.switch5model.split("*");
        
        return tempdata[1];
     }

     if(data == 'switch6')
     {
        tempdata = this.switch6model.split("*");
        
        return tempdata[1];
     }

     if(data == 'switch7')
     {
        tempdata = this.switch7model.split("*");
        
        return tempdata[1];
     }

     if(data == 'switch8')
     {
        tempdata = this.switch8model.split("*");
        
        return tempdata[1];
     }
  }   
  

  sortSwitchDataFillOnce(data: any,msg: any)
  {
     let tempdata: any;     
     if(data == 'switch1')
     {
        tempdata = this.switch1model.split("*");
        this.singlealarmactions.push({switch1:tempdata[1],switchname:msg});
     }

     if(data == 'switch2')
     {
        tempdata = this.switch2model.split("*");
        this.singlealarmactions.push({switch2:tempdata[1],switchname:msg});
        
     }

     if(data == 'switch3')
     {
        tempdata = this.switch3model.split("*");
        this.singlealarmactions.push({switch3:tempdata[1],switchname:msg});
     }

     if(data == 'switch4')
     {
        tempdata = this.switch4model.split("*");
        this.singlealarmactions.push({switch4:tempdata[1],switchname:msg});
     }

     if(data == 'switch5')
     {
        tempdata = this.switch5model.split("*"); 
        this.singlealarmactions.push({switch5:tempdata[1],switchname:msg});
     }

     if(data == 'switch6')
     {
        tempdata = this.switch6model.split("*");   
        this.singlealarmactions.push({switch6:tempdata[1],switchname:msg});
     }

     if(data == 'switch7')
     {
        tempdata = this.switch7model.split("*");   
        this.singlealarmactions.push({switch7:tempdata[1],switchname:msg});
     }

     if(data == 'switch8')
     {
        tempdata = this.switch8model.split("*");   
        this.singlealarmactions.push({switch8:tempdata[1],switchname:msg});
     }
  }         
        


  saveSwitchSelection()
  {
    
    this.showAlert();
  }

  showAlert() 
  {
      let alert: any = this.alertCtrl.create({
        title: 'Confirm',
        message: 'Do you want to save switch settings!',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Ok',
            handler: () => {
              this.switchasgsaved = true;
              this.storage.set('switchedassignedtoalarm',this.switchedassignedtoalarm);
              this.msg = 'Switch settings saved successfully!';
            }
          }
        ]
      });

      
        alert.present();
      
  }


  showAlertSuccess() 
  {
      let alert: any = this.alertCtrl.create({
        title: 'Success',
        message: 'Alarm has been set!',
        buttons: [
        
          {
            text: 'Ok',
            handler: () => {
              
            }
          }
        ]
      });

      
        alert.present();
      
  }

  getData()
  {
   
      this.storage.get('switchonetext').then((value) => {
          if(value != '' && value != null)
          {
            this.switchonetext = value;
          }
         
      });

      this.storage.get('switchtwotext').then((value) => {
          if(value != '' && value != null)
          {
            this.switchtwotext = value;
          }
      });

      this.storage.get('switchthreetext').then((value) => {
          if(value != '' && value != null)
          {
            this.switchthreetext = value;
          }  
          
      });

      this.storage.get('switchfourtext').then((value) => {
          if(value != '' && value != null)
          {
            this.switchfourtext = value;
          }
      });

      this.storage.get('switchfivetext').then((value) => {
          if(value != '' && value != null)
          {
            this.switchfivetext = value;
          }
      });

      this.storage.get('switchsixtext').then((value) => {
          if(value != '' && value != null)
          {
            this.switchsixtext = value;
          }
      });

      this.storage.get('switchseventext').then((value) => {
          if(value != '' && value != null)
          {
            this.switchseventext = value;
          }
      });

      this.storage.get('switcheighttext').then((value) => {
          if(value != '' && value != null)
          {
            this.switcheighttext = value;
          }
      });

      this.storage.get('switchedassignedtoalarm').then((value) => {
         console.log(value);
          if(value != '' && value != null)
          {
            this.switchedassignedtoalarm = value;
            this.switchasgsaved = true;
          }  
          
      });

      this.storage.get('durationoffullcharge').then((value) => {
          if(value != '' && value != null)
          {
            this.durationoffullcharge = value;
          }
      });

      this.storage.get('percentageofchargingpresent').then((value) => {
          if(value != '' && value != null)
          {
            this.percentageofchargingpresent = value;
          }
      });

      
  }



  onStartCharging() {
  
      let datetime: any = this.durationoffullcharge;
      let tempdatetimeformsg: any = datetime.replace("T", " ");
      tempdatetimeformsg = tempdatetimeformsg.slice(0, -5);

      let finaltime: any = new Date(tempdatetimeformsg);

      let totalminuutes: any = finaltime.getHours() * 60;
      totalminuutes = totalminuutes + finaltime.getMinutes();
      let totalseconds = totalminuutes * 60;
      let totalmiliseconds: any = totalseconds * 1000;
      
      let amoutoftimeforonepercentcharging: any =    totalmiliseconds/100;
      let difftimewithamountofchargingpresent: any = amoutoftimeforonepercentcharging * this.percentageofchargingpresent;

      let actualtimetorechange = totalmiliseconds - difftimewithamountofchargingpresent;
      
         
      let datetimetosetnotification: any = new Date();
      
      datetimetosetnotification = datetimetosetnotification.getTime();
    
      let totaltime: any = datetimetosetnotification+actualtimetorechange;

      let finaldatetimetosetnotification = new Date(totaltime);
    
      let datetimetemp: any;
     
      datetimetemp = this.getFormattedDate(finaldatetimetosetnotification);  
      
      let alaramtune:any = 'file:///storage/sdcard0/navin/alarm.mp3';
      
      let datatosend = { usersetdatetime: datetimetemp, title: 'Smart Automation' , desciption: 'Phone Recharged' , soundfile: alaramtune, dataoset: this.getDataForNotification() };

      this.confData.setAlarm(datatosend).subscribe((data: any) => {
          this.showAlertSuccess();
          console.log(data);
      });
  }

  getFormattedDate(finaldatetimetosetnotification: any)
  {
    let datetimetemp = finaldatetimetosetnotification.getFullYear() + "-";
    datetimetemp = datetimetemp + this.formatData(finaldatetimetosetnotification.getMonth()+1) + "-";
    datetimetemp = datetimetemp + this.formatData(finaldatetimetosetnotification.getDate()) + " "; 
    datetimetemp = datetimetemp + this.formatData(finaldatetimetosetnotification.getHours()) + ":";
    datetimetemp = datetimetemp + this.formatData(finaldatetimetosetnotification.getMinutes()) + ":";
    datetimetemp = datetimetemp + this.formatData(finaldatetimetosetnotification.getSeconds());
    return datetimetemp;
  }

  formatData(data: any)
  {
    if(data<10)
    {
     return "0"+data;
    }

    return data;
  }

  onStopCharging()
  {
     this.offSwitch(this.getKeyForSwitch());
  }

  onStartChargingManual()
  {
     this.onSwitch(this.getKeyForSwitch());
  }

  onSwitch(data: any)
  {
    this.confData.hitSwitch(data).subscribe((data: any) => {
        console.log(data);
    });
  }

  offSwitch(data: any)
  {
    this.confData.hitOFFSwitch(data).subscribe((data: any) => {
        console.log(data);
    });
  }


  getKeyForSwitch()
  {
    let dataoset: any;
    
    if(this.switchedassignedtoalarm == 'switch1')
    {
      dataoset = "1";
    }

    if(this.switchedassignedtoalarm == 'switch2')
    {
      dataoset = "2";
    }

    if(this.switchedassignedtoalarm == 'switch3')
    {
      dataoset = "3";
    }

    if(this.switchedassignedtoalarm == 'switch4')
    {
      dataoset = "4";
    }

    if(this.switchedassignedtoalarm == 'switch5')
    {
      dataoset = "5";
    }

    if(this.switchedassignedtoalarm == 'switch6')
    {
      dataoset = "6";
    }

    if(this.switchedassignedtoalarm == 'switch7')
    {
      dataoset = "7";
    }

    if(this.switchedassignedtoalarm == 'switch8')
    {
      dataoset = "8";
    }

    return dataoset;
  }

  getDataForNotification()
  {
    let dataoset: any;
    
    if(this.switchedassignedtoalarm == 'switch1')
    {
      dataoset = {actions:[{switch1: "OFF"}]};
    }

    if(this.switchedassignedtoalarm == 'switch2')
    {
      dataoset = {actions:[{switch2: "OFF"}]};
    }

    if(this.switchedassignedtoalarm == 'switch3')
    {
      dataoset = {actions:[{switch3: "OFF"}]};
    }

    if(this.switchedassignedtoalarm == 'switch4')
    {
      dataoset = {actions:[{switch4: "OFF"}]};
    }

    if(this.switchedassignedtoalarm == 'switch5')
    {
      dataoset = {actions:[{switch5: "OFF"}]};
    }

    if(this.switchedassignedtoalarm == 'switch6')
    {
      dataoset = {actions:[{switch6: "OFF"}]};
    }

    if(this.switchedassignedtoalarm == 'switch7')
    {
      dataoset = {actions:[{switch7: "OFF"}]};
    }

    if(this.switchedassignedtoalarm == 'switch8')
    {
      dataoset = {actions:[{switch8: "OFF"}]};
    }

    return dataoset;
  }


}
