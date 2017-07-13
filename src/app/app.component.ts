import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform, ToastController, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SchedulePage } from '../pages/schedule/schedule';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { SupportPage } from '../pages/support/support';
import { EditinfoPage } from '../pages/editinfo/editinfo';
import { PhonePage } from '../pages/phone/phone';
import { LaptopPage } from '../pages/laptop/laptop';
import { WatermotorPage } from '../pages/watermotor/watermotor';
import { AlarmPage } from '../pages/alarm/alarm';


import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

import { Autostart } from '@ionic-native/autostart';
import { BackgroundMode } from '@ionic-native/background-mode';
import { NativeAudio } from '@ionic-native/native-audio';


declare var cordova:any;
declare var Media:any;

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Settings', name: 'TabsPage', component: TabsPage, tabComponent: SchedulePage, index: 0, icon: 'calendar' },
    { title: 'Home', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 1, icon: 'contacts' },
    { title: 'Laptop', name: 'TabsPage', component: TabsPage, tabComponent: LaptopPage, index: 2, icon: 'map' },
    { title: 'Phone', name: 'TabsPage', component: TabsPage, tabComponent: AboutPage, index: 3, icon: 'information-circle' },
    { title: 'Water Tank', name: 'TabsPage', component: TabsPage, tabComponent: AboutPage, index: 3, icon: 'information-circle' },
    { title: 'Alarm', name: 'TabsPage', component: TabsPage, tabComponent: AboutPage, index: 3, icon: 'information-circle' }
  ];
  loggedInPages: PageInterface[] = [
    
    { title: 'Home', name: 'TabsPage', component: TabsPage, tabComponent: SchedulePage, index: 0, icon: 'contacts' },
    { title: 'Laptop', name: 'TabsPage', component: TabsPage, tabComponent: LaptopPage, index: 1, icon: 'map' },
    { title: 'Phone', name: 'TabsPage', component: TabsPage, tabComponent: PhonePage, index: 3, icon: 'information-circle' },
    { title: 'Water Motor', name: 'TabsPage', component: TabsPage, tabComponent: WatermotorPage, index: 2, icon: 'information-circle' },
    { title: 'Edit', name: 'EditinfoPage', component: TabsPage, tabComponent: EditinfoPage, icon: 'information-circle' },
    { title: 'Alarm', name: 'AlarmPage', component: AlarmPage, icon: 'person' },   
    { title: 'Account', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help' },
    { title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help' },
    { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
  ];
  rootPage: any;
  userloggedinornot: boolean = false;
  alert: any;
  my_media: any;

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
    public storage: Storage,
    public toast: ToastController,
    private alertCtrl: AlertController,
    private backgroundMode: BackgroundMode,
    private autostart: Autostart,
    private nativeAudio: NativeAudio,
    public splashScreen: SplashScreen
  ) {
    
    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          //this.rootPage = TabsPage;
          //this.rootPage = LoginPage;
        } else {
          //this.rootPage = TutorialPage;
          //this.rootPage = LoginPage;
        }
        this.platformReady()
      });

    // load the conference data
    confData.load();
    let pointer: any = this;

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      
      this.enableMenu(hasLoggedIn === true);

      if(hasLoggedIn == true)
      {
        pointer.userloggedinornot = true;
        pointer.rootPage = SchedulePage;
      }else
      {
        pointer.rootPage = LoginPage;
      }

    });

    this.enableMenu(true);

    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    // Set the root of the nav with params if it's a tab index
  } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
      this.nav.setRoot(LoginPage);
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  waistFunc()
  {
    console.log(this.backgroundMode);
  }

  toastfun(data: string) 
  {
      let toast = this.toast.create({
        message: data,
        duration: 3000,
        position: 'middle'
      });

      toast.onDidDismiss(() => {
       
        //this.changePassPrompt('');
      });

      toast.present();
  }

  showAlert() 
  {
      this.alert = this.alertCtrl.create({
        title: 'Exit?',
        message: 'Do not exit the app ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.alert =null;
            }
          },
          {
            text: 'Exit',
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });

      if(this.alert != undefined)
      {
        this.alert.present();
      }  
  }

  platformReady() {
    
    let check: any = this;

    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.autostart.enable();

      if(this.platform.is('cordova'))
      {
        /*cordova.plugins.notification.local.on('click', function (notification) {
            console.log('onclick', arguments);
            check.toastfun('clicked: ' + notification.id);
        });*/
        
        cordova.plugins.backgroundMode.setEnabled(true);
        cordova.plugins.backgroundMode.overrideBackButton();
        cordova.plugins.backgroundMode.excludeFromTaskList();

        cordova.plugins.notification.local.on('trigger', function (notification: any) {
            
            let obj: any = JSON.parse(notification.data);
            let simpledata: any = obj.actions[0];

            if(simpledata.hasOwnProperty('switch1')){
                check.storage.set('switchonetimernotset','no');
                if(simpledata.switch1 == 'ON')
                {
                  check.onSwitch(1);
                }

                if(simpledata.switch1 == 'OFF')
                {
                  check.offSwitch(1);
                }
            }

            if(simpledata.hasOwnProperty('switch2')){
                check.storage.set('switchtwotimernotset','no');
                if(simpledata.switch2 == 'ON')
                {
                  check.onSwitch(2);
                }

                if(simpledata.switch2 == 'OFF')
                {
                  check.offSwitch(2);
                }
            }

            if(simpledata.hasOwnProperty('switch3')){
                check.storage.set('switchthreetimernotset','no');
                if(simpledata.switch3 == 'ON')
                {
                  check.onSwitch(3);
                }

                if(simpledata.switch3 == 'OFF')
                {
                  check.offSwitch(3);
                }
            }

            if(simpledata.hasOwnProperty('switch4')){
                check.storage.set('switchfourtimernotset','no');
                if(simpledata.switch4 == 'ON')
                {
                  check.onSwitch(4);
                }

                if(simpledata.switch4 == 'OFF')
                {
                  check.offSwitch(4);
                }
            }

            if(simpledata.hasOwnProperty('switch5')){
                check.storage.set('switchfivetimernotset','no');
                if(simpledata.switch5 == 'ON')
                {
                  check.onSwitch(5);
                }

                if(simpledata.switch5 == 'OFF')
                {
                  check.offSwitch(5);
                }
            }

            if(simpledata.hasOwnProperty('switch6')){
                check.storage.set('switchsixtimernotset','no');
                if(simpledata.switch6 == 'ON')
                {
                  check.onSwitch(6);
                }

                if(simpledata.switch6 == 'OFF')
                {
                  check.offSwitch(6);
                }
            }

            if(simpledata.hasOwnProperty('switch7')){
                check.storage.set('switchseventimernotset','no');
                if(simpledata.switch7 == 'ON')
                {
                  check.onSwitch(7);
                }

                if(simpledata.switch7 == 'OFF')
                {
                  check.offSwitch(7);
                }
            }

            if(simpledata.hasOwnProperty('switch8')){
                check.storage.set('switcheighttimernotset','no');
                if(simpledata.switch8 == 'ON')
                {
                  check.onSwitch(8);
                }

                if(simpledata.switch8 == 'OFF')
                {
                  check.offSwitch(8);
                }
            }
            
            //code for alarm
            if(obj.hasOwnProperty('tune'))
            {
              
              /*check.nativeAudio.preloadComplex('uniqueId1', obj.tunepath, 1, 1, 0).then(function(msg: any){
                alert(msg);
              }, function(msg: any){
                alert( 'error: ' + msg );
              });*/

              check.playAudio(obj.tunepath);
            
            
              if(obj.actions.length > 1)
              {
                for(let i=1;i<obj.actions.length;i++)
                {
                  simpledata = obj.actions[i];  
                  check.alaramFlow(simpledata);
                  

                }
              }
              //
            }  

            
        });
      }  

      this.platform.registerBackButtonAction(() => {
        if(this.nav.canGoBack()){
          this.nav.pop();
        }else{
          if(this.alert){ 
            this.alert.dismiss();
            this.alert =null;     
          }else{
            //this.showAlert();
           }
        }

      });

    });//platform ready ends here
  }

  playAudio(url: any) {
 
      // Play the audio file at url
      this.my_media = new Media(url,
          // success callback
          function () { console.log("playAudio():Audio Success"); },
          // error callback
          function (err: any) { alert("playAudio():Audio Error: " + JSON.stringify(err)); }
      );

     
      // Play audio
      this.my_media.play();
      let check: any = this;
      // Pause after 10 min
      
     
      if(this.my_media.getDuration()>-1)
      {
        let duration_time: any = this.my_media.getDuration() * 1000;
        setTimeout(function () {
          check.my_media.stop();
          check.my_media.play();
        }, duration_time);

      }else
      {
        setTimeout(function () {
          check.my_media.stop();
          check.my_media.play();
        }, 600000);
      }
      
  }

  stopAlarmTune()
  {
    if(this.my_media != undefined)
    {
      this.my_media.stop();
      this.my_media.release();
      this.my_media = undefined;
    }
  }

  onSuccess()
  {
    alert("playing");
    this.nativeAudio.play('uniqueId1', () => alert('uniqueId1 is done playing'));
  }

  onError()
  {
    alert("alarm tune error");
  }

  alaramFlow(simpledata: any)
  {   
              let check: any = this; 
              if(simpledata.hasOwnProperty('switch1')){
                
                if(simpledata.switch1 == 'ON')
                {
                  check.onSwitch(1);
                }

                if(simpledata.switch1 == 'OFF')
                {
                  check.offSwitch(1);
                }
            }

            if(simpledata.hasOwnProperty('switch2')){
                
                if(simpledata.switch2 == 'ON')
                { 
                  check.onSwitch(2);
                }

                if(simpledata.switch2 == 'OFF')
                {
                  check.offSwitch(2);
                }
            }

            if(simpledata.hasOwnProperty('switch3')){
                
                if(simpledata.switch3 == 'ON')
                {
                  check.onSwitch(3);
                }

                if(simpledata.switch3 == 'OFF')
                {
                  check.offSwitch(3);
                }
            }

            if(simpledata.hasOwnProperty('switch4')){
                
                if(simpledata.switch4 == 'ON')
                {
                  check.onSwitch(4);
                }

                if(simpledata.switch4 == 'OFF')
                {
                  check.offSwitch(4);
                }
            }

            if(simpledata.hasOwnProperty('switch5')){
                
                if(simpledata.switch5 == 'ON')
                {
                  check.onSwitch(5);
                }

                if(simpledata.switch5 == 'OFF')
                {
                  check.offSwitch(5);
                }
            }

            if(simpledata.hasOwnProperty('switch6')){
                
                if(simpledata.switch6 == 'ON')
                {
                  check.onSwitch(6);
                }

                if(simpledata.switch6 == 'OFF')
                {
                  check.offSwitch(6);
                }
            }

            if(simpledata.hasOwnProperty('switch7')){
                
                if(simpledata.switch7 == 'ON')
                {
                  check.onSwitch(7);
                }

                if(simpledata.switch7 == 'OFF')
                {
                  check.offSwitch(7);
                }
            }

            if(simpledata.hasOwnProperty('switch8')){
               
                if(simpledata.switch8 == 'ON')
                {
                  check.onSwitch(8);
                }

                if(simpledata.switch8 == 'OFF')
                {
                  check.offSwitch(8);
                }
            }
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

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}
