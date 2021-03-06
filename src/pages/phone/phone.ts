import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { PhoneOptions } from '../../interfaces/user-options';
import { Storage } from '@ionic/storage';

import { ConferenceData } from '../../providers/conference-data';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  selector: 'page-phone',
  templateUrl: 'phone.html'
})
export class PhonePage {
  switches: PhoneOptions = { switchassigned: '', chargingtime: '', percentagechargednow: '' };
  submitted = false;
  switchedassignedtophone: any;

  switchonetext: any = 'Switch One';
  switchtwotext: any = 'Switch Two';
  switchthreetext: any = 'Switch Three';
  switchfourtext: any = 'Switch Four';
  switchfivetext: any = 'Switch Five';
  switchsixtext: any = 'Switch Six';
  switchseventext: any = 'Switch Seven';
  switcheighttext: any = 'Switch Eight';

  durationoffullcharge: any;
  percentageofchargingpresent: any = 10;
  msg: any = '';
  switchasgsaved: boolean = false;
  idofphonetimer: any;
  isphonetimerset: boolean = false;
  presentcharginginthisphone: number = 0;
  isphonepluggedinforcharging: string = '';
  
  constructor(public navCtrl: NavController, public userData: UserData, public storage: Storage, public alertCtrl: AlertController, public confData: ConferenceData, private localNotifications: LocalNotifications) 
  {
    this.switchedassignedtophone = 0;

    this.durationoffullcharge = new Date().toISOString();

    let check: any = this;
    
    setInterval(function(){ 
      check.getData(); 
    }, 5000);
  }

  saveSwitchSelection()
  {
    

    if(this.switchedassignedtophone == 0)
    {
      this.showAlertSwitchCheck();
      return true;
    }
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
             
            

              this.storage.set('switchedassignedtophone',this.switchedassignedtophone);
              this.storage.set('timetakenbyphonetofullcharge',this.durationoffullcharge);
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
        message: 'Phone is charging now!',
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

      this.storage.get('switchedassignedtophone').then((value) => {
         console.log(value);
          if(value != '' && value != null)
          {
            this.switchedassignedtophone = value;
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

      this.storage.get('timetakenbyphonetofullcharge').then((value) => {
          if(value != '' && value != null)
          {
            this.durationoffullcharge = value;
          }
      });


      this.storage.get('batterypersentageofthisphone').then((value) => {
          if(value != '' && value != null)
          {
            this.presentcharginginthisphone = parseInt(value);
            this.percentageofchargingpresent = this.presentcharginginthisphone; 
          }
      });

      this.storage.get('thisphoneispluggedinornot').then((value) => {
          if(value != '' && value != null)
          {
            this.isphonepluggedinforcharging = value;
          }
      });
      
  }

  showAlertSwitchCheck() 
  {
      let alert: any = this.alertCtrl.create({
        title: 'Success',
        message: 'Please select a switch for phone!',
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

  onStartCharging() {
  
      if(this.switchedassignedtophone == 0)
      {
        this.showAlertSwitchCheck();
        return true;
      }

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

      let check: any = this;
      this.confData.setAlarm(datatosend).subscribe((data: any) => {
          this.showAlertSuccess();
          this.onSwitch(this.getKeyForSwitch());

          setTimeout(function(){
             check.listAlarm();
          }, 2000);
         
          console.log(data);
      });
  }

  onUnsetPhoneTimer(idofphonetimer: any)
  {
      this.localNotifications.clear(idofphonetimer).then(() => {
                      
      });

      this.localNotifications.cancel(idofphonetimer).then(() => {
          this.idofphonetimer = 0;
          this.isphonetimerset = false;
      });
  }

  showConfirm(idofphonetimer: any) 
  {
      let alert: any = this.alertCtrl.create({
        title: 'Confirm',
        message: 'Do you want to unset phone timer!',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Ok',
            handler: () => {
              this.onUnsetPhoneTimer(idofphonetimer);
            }
          }
        ]
      });

      
      alert.present();
      
  }

  listAlarm()
  {
   
    this.confData.getAlarm().subscribe((data: any) => {
            console.log(data);
            
            let obj: any = data.data;
            let singlenotification: any;
            let simpledata: any;

            if(obj.length > 0)
            {
              for(let i=0;i<obj.length;i++)
              {
                singlenotification = obj[i];
                simpledata = JSON.parse(singlenotification.data);
               
                if(simpledata.hasOwnProperty('phone'))
                {
                  //means phone timer set
                  this.idofphonetimer = singlenotification.id;
                 
                  this.isphonetimerset = true;
                }
              }
            }
            

          
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
    
    if(this.switchedassignedtophone == 'switch1')
    {
      dataoset = "1";
    }

    if(this.switchedassignedtophone == 'switch2')
    {
      dataoset = "2";
    }

    if(this.switchedassignedtophone == 'switch3')
    {
      dataoset = "3";
    }

    if(this.switchedassignedtophone == 'switch4')
    {
      dataoset = "4";
    }

    if(this.switchedassignedtophone == 'switch5')
    {
      dataoset = "5";
    }

    if(this.switchedassignedtophone == 'switch6')
    {
      dataoset = "6";
    }

    if(this.switchedassignedtophone == 'switch7')
    {
      dataoset = "7";
    }

    if(this.switchedassignedtophone == 'switch8')
    {
      dataoset = "8";
    }

    return dataoset;
  }

  getDataForNotification()
  {
    let dataoset: any;
    
    if(this.switchedassignedtophone == 'switch1')
    {
      dataoset = {actions:[{switch1: "OFF"}], phone:'yes'};
    }

    if(this.switchedassignedtophone == 'switch2')
    {
      dataoset = {actions:[{switch2: "OFF"}], phone:'yes'};
    }

    if(this.switchedassignedtophone == 'switch3')
    {
      dataoset = {actions:[{switch3: "OFF"}], phone:'yes'};
    }

    if(this.switchedassignedtophone == 'switch4')
    {
      dataoset = {actions:[{switch4: "OFF"}], phone:'yes'};
    }

    if(this.switchedassignedtophone == 'switch5')
    {
      dataoset = {actions:[{switch5: "OFF"}], phone:'yes'};
    }

    if(this.switchedassignedtophone == 'switch6')
    {
      dataoset = {actions:[{switch6: "OFF"}], phone:'yes'};
    }

    if(this.switchedassignedtophone == 'switch7')
    {
      dataoset = {actions:[{switch7: "OFF"}], phone:'yes'};
    }

    if(this.switchedassignedtophone == 'switch8')
    {
      dataoset = {actions:[{switch8: "OFF"}], phone:'yes'};
    }

    return dataoset;
  }


}
