import { Component, ViewChild } from '@angular/core';

import { AlertController, App, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { Storage } from '@ionic/storage';


/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';




@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  i: number = 60;

  switchonetext: any = 'Switch One';
  switchonetimer: any;
  switchoneaction: any;
  switchonetimernotset: boolean = true;
  switchonemsg: string = '';

  switchtwotext: any = 'Switch Two';
  switchtwotimer: any;
  switchtwoaction: any;
  switchtwotimernotset: boolean = true;
  switchtwomsg: string = '';

  switchthreetext: any = 'Switch Three';
  switchthreetimer: any;
  switchthreeaction: any;
  switchthreetimernotset: boolean = true;
  switchthreemsg: string = '';

  switchfourtext: any = 'Switch Four';
  switchfourtimer: any;
  switchfouraction: any;
  switchfourtimernotset: boolean = true;
  switchfourmsg: string = '';

  switchfivetext: any = 'Switch Five';
  switchfivetimer: any;
  switchfiveaction: any;
  switchfivetimernotset: boolean = true;
  switchfivemsg: string = '';


  switchsixtext: any = 'Switch Six';
  switchsixtimer: any;
  switchsixaction: any;
  switchsixtimernotset: boolean = true;
  switchsixmsg: string = '';


  switchseventext: any = 'Switch Seven';
  switchseventimer: any;
  switchsevenaction: any;
  switchseventimernotset: boolean = true;
  switchsevenmsg: string = '';


  switcheighttext: any = 'Switch Eight';
  switcheighttimer: any;
  switcheightaction: any;
  switcheighttimernotset: boolean = true;
  switcheightmsg: string = '';


  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public confData: ConferenceData,
    public storage: Storage,
    public user: UserData,
  ) 
  {
    this.switchonetimer = new Date().toISOString();
    this.switchoneaction = 'ON';
   
    this.onTimer();
   
    this.switchtwotimer = new Date().toISOString();
    this.switchtwoaction = 'ON';

    this.switchthreetimer = new Date().toISOString();
    this.switchthreeaction = 'ON';

    this.switchfourtimer = new Date().toISOString();
    this.switchfouraction = 'ON';

    this.switchfivetimer = new Date().toISOString();
    this.switchfiveaction = 'ON';

    this.switchsixtimer = new Date().toISOString();
    this.switchsixaction = 'ON';

    this.switchseventimer = new Date().toISOString();
    this.switchsevenaction = 'ON';

    this.switcheighttimer = new Date().toISOString();
    this.switcheightaction = 'ON';
      
  }

  onTimer() {
      let pointer: any = this;
      setInterval(function(){ pointer.checkTimer(); }, 30000);
  }

  checkTimer()
  {

    this.storage.get('switchonetimernotset').then((value) => {
        if(value == 'yes'){ this.switchonetimernotset = false; 
        }else{ this.switchonetimernotset = true; }

      this.storage.get('switchonetimermsg').then((value) => {
          this.switchonemsg = value;
      });

    });

    this.storage.get('switchtwotimernotset').then((value) => {
        if(value == 'yes'){ this.switchtwotimernotset = false; 
        }else{ this.switchtwotimernotset = true; }

      this.storage.get('switchtwotimermsg').then((value) => {
          this.switchtwomsg = value;
      });

    });

    this.storage.get('switchthreetimernotset').then((value) => {
        if(value == 'yes'){ this.switchthreetimernotset = false; 
        }else{ this.switchthreetimernotset = true; }

      this.storage.get('switchthreetimermsg').then((value) => {
          this.switchthreemsg = value;
      });

    });

    this.storage.get('switchfourtimernotset').then((value) => {
        if(value == 'yes'){ this.switchfourtimernotset = false; 
        }else{ this.switchfourtimernotset = true; }

      this.storage.get('switchfourtimermsg').then((value) => {
          this.switchfourmsg = value;
      });

    });


    this.storage.get('switchfivetimernotset').then((value) => {
        if(value == 'yes'){ this.switchfivetimernotset = false; 
        }else{ this.switchfivetimernotset = true; }

      this.storage.get('switchfivetimermsg').then((value) => {
          this.switchfivemsg = value;
      });

    });

    this.storage.get('switchsixtimernotset').then((value) => {
        if(value == 'yes'){ this.switchsixtimernotset = false; 
        }else{ this.switchsixtimernotset = true; }

      this.storage.get('switchsixtimermsg').then((value) => {
          this.switchsixmsg = value;
      });

    });

    this.storage.get('switchseventimernotset').then((value) => {
        if(value == 'yes'){ this.switchseventimernotset = false; 
        }else{ this.switchseventimernotset = true; }

      this.storage.get('switchseventimermsg').then((value) => {
          this.switchsevenmsg = value;
      });

    });

    this.storage.get('switcheighttimernotset').then((value) => {
        if(value == 'yes'){ this.switcheighttimernotset = false; 
        }else{ this.switcheighttimernotset = true; }

      this.storage.get('switcheighttimermsg').then((value) => {
          this.switcheightmsg = value;
      });

    });

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

  onSetTimer(data: any)
  {
    console.log(data);
    console.log(this.switchoneaction);
    console.log(this.switchonetimer);
    console.log(this.switchonetext);
    
    let datetime: any;
    let titletosend: any;
    let actiontosend: any;
    let alaramtune: any;
    let dataoset: any;
    let tempdatetimeformsg: any;

    if(data == 'switch1')
    {
      datetime = this.switchonetimer;
      tempdatetimeformsg = datetime.replace("T", " ");
      tempdatetimeformsg = tempdatetimeformsg.slice(0, -5);
    
      titletosend = 'Smart Automation'  
      actiontosend = this.switchonetext + ' is turned '+ this.switchoneaction + ' ';
      alaramtune = 'file:///storage/sdcard0/navin/alarm.mp3';
      dataoset = {actions:[{switch1: this.switchoneaction}]};
      this.storage.set('switchonetimernotset','yes');
      this.storage.set('switchonetimermsg',this.switchonetext + ' will trun '+ this.switchoneaction + ' at ' + tempdatetimeformsg);
      
    }
    
    if(data == 'switch2')
    {
      datetime = this.switchtwotimer;
      titletosend = 'Smart Automation'  
      actiontosend = this.switchtwotext + ' is turned '+ this.switchtwoaction + ' ';
      alaramtune = 'file:///storage/sdcard0/navin/alarm.mp3';
      dataoset = {actions:[{switch2: this.switchtwoaction}]};
    }

    if(data == 'switch3')
    {
      datetime = this.switchthreetimer;
      titletosend = 'Smart Automation'  
      actiontosend = this.switchthreetext + ' is turned '+ this.switchthreeaction + ' ';
      alaramtune = 'file:///storage/sdcard0/navin/alarm.mp3';
      dataoset = {actions:[{switch3: this.switchthreeaction}]};
    }

    if(data == 'switch4')
    {
      datetime = this.switchfourtimer;
      titletosend = 'Smart Automation'  
      actiontosend = this.switchfourtext + ' is turned '+ this.switchfouraction + ' ';
      alaramtune = 'file:///storage/sdcard0/navin/alarm.mp3';
      dataoset = {actions:[{switch4: this.switchfouraction}]};
    }

    if(data == 'switch5')
    {
      datetime = this.switchfivetimer;
      titletosend = 'Smart Automation'  
      actiontosend = this.switchfivetext + ' is turned '+ this.switchfiveaction + ' ';
      alaramtune = 'file:///storage/sdcard0/navin/alarm.mp3';
      dataoset = {actions:[{switch5: this.switchfiveaction}]};
    } 

    if(data == 'switch6')
    {
      datetime = this.switchsixtimer;
      titletosend = 'Smart Automation'  
      actiontosend = this.switchsixtext + ' is turned '+ this.switchsixaction + ' ';
      alaramtune = 'file:///storage/sdcard0/navin/alarm.mp3';
      dataoset = {actions:[{switch6: this.switchsixaction}]};
    }  

    if(data == 'switch7')
    {
      datetime = this.switchseventimer;
      titletosend = 'Smart Automation'  
      actiontosend = this.switchseventext + ' is turned '+ this.switchsevenaction + ' ';
      alaramtune = 'file:///storage/sdcard0/navin/alarm.mp3';
      dataoset = {actions:[{switch7: this.switchsevenaction}]};
    }

    if(data == 'switch8')
    {
      datetime = this.switcheighttimer;
      titletosend = 'Smart Automation'  
      actiontosend = this.switcheighttext + ' is turned '+ this.switcheightaction + ' ';
      alaramtune = 'file:///storage/sdcard0/navin/alarm.mp3';
      dataoset = {actions:[{switch8: this.switcheightaction}]};
    }

    datetime = datetime.replace("T", " ");
   
    datetime = datetime.slice(0, -5);
   


    let datatosend = { usersetdatetime: datetime, title: titletosend , desciption: actiontosend , soundfile: alaramtune, dataoset: dataoset };

    this.confData.setAlarm(datatosend).subscribe((data: any) => {
        this.showAlert();
        this.checkTimer();
        console.log(data);
    });

  }

  showAlert() 
  {
      let alert: any = this.alertCtrl.create({
        title: 'Success',
        message: 'Timer set!',
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

/*
   sendTestNotification(){
    let datatosend = {eventid:this.eventid};
           this.showLoading();   
           this.auth.sendTestNotification(datatosend).subscribe((data: any) => {
            console.log("notification data ");
            console.log(data);
        
              if(data.resposerecieved == 'found')
              {
                 if(this.loading != undefined)
                  {
                    this.loading.dismiss(); 
                  }
                 this.viewCtrl.dismiss({key:'showsuccessnoticationpopup'});
                 
                 
              }else if(data.resposerecieved == 'notfound')
              {
                  if(this.loading != undefined)
                  {
                    this.loading.dismiss(); 
                  }
                  this.viewCtrl.dismiss({key:'showfailnoticationpopup'});
              }else if(data.resposerecieved == 'false')
              {
                  if(this.loading != undefined)
                  {
                    this.loading.dismiss(); 
                  }
                  this.showError(data.errordescription.message);
              }     
            

           });

  }*/

  ionViewDidLoad() {
    
  }

 

  doRefresh(refresher: Refresher) {
    
     
      // simulate a network request that would take longer
      // than just pulling from out local json file
      setTimeout(() => {
        refresher.complete();

        const toast = this.toastCtrl.create({
          message: 'Sessions have been updated.',
          duration: 3000
        });
        toast.present();
      }, 1000);
  
  }
}
