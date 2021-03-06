import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { PhoneOptions } from '../../interfaces/user-options';
import { Storage } from '@ionic/storage';

import { ConferenceData } from '../../providers/conference-data';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  selector: 'page-watermotor',
  templateUrl: 'watermotor.html'
})
export class WatermotorPage {
  switches: PhoneOptions = { switchassigned: '', chargingtime: '', percentagechargednow: '' };
  submitted = false;
  switchedassignedtowatermotor: any;

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
  idofwatermotortimer: any;
  iswatermotortimerset: boolean = false;
  diameteroftank: number = 0;
  heightoftank: number = 0;
  liquidheight: number = 0;
  //formulat pi r square into height devided by 1000 cetimeters
  //http://alloiltank.com/tank-volume-calculator/

  
  constructor(public navCtrl: NavController, public userData: UserData, public storage: Storage, public alertCtrl: AlertController, public confData: ConferenceData, private localNotifications: LocalNotifications) 
  {
    this.switchedassignedtowatermotor = 0;

    this.durationoffullcharge = new Date().toISOString();
    this.getData();
  }



  saveSwitchSelection()
  {
    if(this.switchedassignedtowatermotor == 0)
    {
      this.showAlertSwitchCheck();
      return true;
    }
    
    this.showAlert();
  }

  checkWaterLevel()
  {

    if(this.diameteroftank == 0 || this.heightoftank == 0)
    {
      this.showMsgError();
      return true;
    }

    this.storage.set('diameteroftank',this.diameteroftank);
    this.storage.set('heightoftank',this.heightoftank);

    let howfaristheobjectreadingsrc: any;


    let responsearray: any = [];
    let pointer: any = this;

   
    this.confData.checkWaterLevel().subscribe((data1: any) => {
      console.log(data1);
      if(data1.hasOwnProperty('distance')){
        responsearray.push(data1.distance);
      }         
     
        this.confData.checkWaterLevel().subscribe((data2: any) => {
          console.log(data2);
          if(data2.hasOwnProperty('distance')){
            responsearray.push(data2.distance);
          }    
         
            this.confData.checkWaterLevel().subscribe((data3: any) => {
              console.log(data3);
              if(data3.hasOwnProperty('distance')){
                responsearray.push(data3.distance);
              }  

                this.confData.checkWaterLevel().subscribe((data4: any) => {
                  console.log(data4);
                  if(data4.hasOwnProperty('distance')){
                    responsearray.push(data4.distance);
                  }

                    this.confData.checkWaterLevel().subscribe((data5: any) => {
                      console.log(data5);
                      if(data5.hasOwnProperty('distance')){
                        responsearray.push(data5.distance);
                      }  
                        

                        let min: any = Math.min.apply(null, responsearray);
                        let leftarrayfirst: any = responsearray.filter((e: any) => {return e != min});
                         

                        min = Math.min.apply(null, leftarrayfirst);
                        let leftarray: any = leftarrayfirst.filter((e: any) => {return e != min});
                        
                       
                        
                        let i: any = 0;
                        let sumofreadings: any = 0;

                        for(i=0;i<leftarray.length;i++)
                        {
                            sumofreadings = sumofreadings + leftarray[i];
                        }

                        howfaristheobjectreadingsrc = sumofreadings/i+1;
                        
                        pointer.checkWaterLevelStep2(howfaristheobjectreadingsrc);

                    });    

                }); 

            });

        });

    });
  }

  checkWaterLevelStep2(howfaristheobjectreadingsrc: any)
  {
    

    this.liquidheight = this.heightoftank - howfaristheobjectreadingsrc;
    
    
    let pi: any = 3.14159;
    let radiusoftank: any = this.diameteroftank/2;
    let rsquare: any = radiusoftank * radiusoftank;

    let totalcapacityoftankinleters: any;

    totalcapacityoftankinleters = pi * rsquare * this.heightoftank / 1000;

    
    let waterpresentinliters: any;

    waterpresentinliters =   pi * rsquare * this.liquidheight / 1000;

    
    let percentageoftankfilled: any;

    percentageoftankfilled = waterpresentinliters/totalcapacityoftankinleters;

    percentageoftankfilled = percentageoftankfilled * 100;

    
    this.percentageofchargingpresent = percentageoftankfilled;

    

    //formulat pi r square into height devided by 1000 cetimeters
    //http://alloiltank.com/tank-volume-calculator/

  } 

  removeSmallest(arr: any) {
    let min: any = Math.min.apply(null, arr);
    return arr.filter((e: any) => {return e != min});
  }

  showMsgError() 
  {
      let alert: any = this.alertCtrl.create({
        title: 'OOPS!',
        message: 'Please enter diameter and height of tank!',
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
              this.storage.set('switchedassignedtowatermotor',this.switchedassignedtowatermotor);
              this.storage.set('timetakenbywatermotortofullcharge',this.durationoffullcharge);
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
        message: 'Water Motor is running now!',
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

      this.storage.get('switchedassignedtowatermotor').then((value) => {
         console.log(value);
          if(value != '' && value != null)
          {
            this.switchedassignedtowatermotor = value;
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

      this.storage.get('timetakenbywatermotortofullcharge').then((value) => {
          if(value != '' && value != null)
          {
            this.durationoffullcharge = value;
          }
      });

      this.storage.get('diameteroftank').then((value) => {
          if(value != '' && value != null)
          {
            this.diameteroftank = value;
          }
      });

      this.storage.get('heightoftank').then((value) => {
          if(value != '' && value != null)
          {
            this.heightoftank = value;
          }
      });
     
  }

  showAlertSwitchCheck() 
  {
      let alert: any = this.alertCtrl.create({
        title: 'Success',
        message: 'Please select a switch for water motor!',
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

      if(this.switchedassignedtowatermotor == 0)
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
      
      let datatosend = { usersetdatetime: datetimetemp, title: 'Smart Automation' , desciption: 'Water Tank Filled ' , soundfile: alaramtune, dataoset: this.getDataForNotification() };

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

  onUnsetWaterMotorTimer(idofwatermotortimer: any)
  {
      this.localNotifications.clear(idofwatermotortimer).then(() => {
                      
      });

      this.localNotifications.cancel(idofwatermotortimer).then(() => {
          this.idofwatermotortimer = 0;
          this.iswatermotortimerset = false;
      });
  }

  showConfirm(idofwatermotortimer: any) 
  {
      let alert: any = this.alertCtrl.create({
        title: 'Confirm',
        message: 'Do you want to unset water motor timer!',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Ok',
            handler: () => {
              this.onUnsetWaterMotorTimer(idofwatermotortimer);
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
               
                if(simpledata.hasOwnProperty('watermotor'))
                {
                  //means watermotor timer set
                  this.idofwatermotortimer = singlenotification.id;
                 
                  this.iswatermotortimerset = true;
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
    
    if(this.switchedassignedtowatermotor == 'switch1')
    {
      dataoset = "1";
    }

    if(this.switchedassignedtowatermotor == 'switch2')
    {
      dataoset = "2";
    }

    if(this.switchedassignedtowatermotor == 'switch3')
    {
      dataoset = "3";
    }

    if(this.switchedassignedtowatermotor == 'switch4')
    {
      dataoset = "4";
    }

    if(this.switchedassignedtowatermotor == 'switch5')
    {
      dataoset = "5";
    }

    if(this.switchedassignedtowatermotor == 'switch6')
    {
      dataoset = "6";
    }

    if(this.switchedassignedtowatermotor == 'switch7')
    {
      dataoset = "7";
    }

    if(this.switchedassignedtowatermotor == 'switch8')
    {
      dataoset = "8";
    }

    return dataoset;
  }

  getDataForNotification()
  {
    let dataoset: any;
    
    if(this.switchedassignedtowatermotor == 'switch1')
    {
      dataoset = {actions:[{switch1: "OFF"}], watermotor:'yes'};
    }

    if(this.switchedassignedtowatermotor == 'switch2')
    {
      dataoset = {actions:[{switch2: "OFF"}], watermotor:'yes'};
    }

    if(this.switchedassignedtowatermotor == 'switch3')
    {
      dataoset = {actions:[{switch3: "OFF"}], watermotor:'yes'};
    }

    if(this.switchedassignedtowatermotor == 'switch4')
    {
      dataoset = {actions:[{switch4: "OFF"}], watermotor:'yes'};
    }

    if(this.switchedassignedtowatermotor == 'switch5')
    {
      dataoset = {actions:[{switch5: "OFF"}], watermotor:'yes'};
    }

    if(this.switchedassignedtowatermotor == 'switch6')
    {
      dataoset = {actions:[{switch6: "OFF"}], watermotor:'yes'};
    }

    if(this.switchedassignedtowatermotor == 'switch7')
    {
      dataoset = {actions:[{switch7: "OFF"}], watermotor:'yes'};
    }

    if(this.switchedassignedtowatermotor == 'switch8')
    {
      dataoset = {actions:[{switch8: "OFF"}], watermotor:'yes'};
    }

    return dataoset;
  }


}
