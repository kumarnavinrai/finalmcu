import { LoadingController, Loading } from 'ionic-angular';

import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';


@Injectable()
export class ConferenceData {
  data: any;
  loading: Loading;
  //urlForApi: string = 'http://192.168.43.167';
  urlForApi: string = 'http://192.168.43.247';

  constructor(public http: Http, public user: UserData, private localNotifications: LocalNotifications, public loadingCtrl: LoadingController) 
  { 



  }

  /*hitSwitch(datatopass: any): any {
    if (!datatopass) {
      return Observable.of({switchnothit:"on"});
    } else {
      let tempurl = 'https://www.google.com';
     
      return this.http.get(tempurl) 
                       .map((res:Response) => res.json()) 
                       .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 

    }
  }*/

  checkWaterLevel(): any {
    
    let tempurl = this.urlForApi + '/SRC=ULTRASONIC';
   
    return this.http.get(tempurl);
  
  }

  hitSwitch(data: any): any {
    
    let tempurl = this.urlForApi + '/pin=OFF'+this.getDataFromUrl(data);
   
    if (!data) {
      return Observable.of(data);
    } else {
      return this.http.get(tempurl);
    }
  }

  getDataFromUrl(data: any)
  {

     if(data == 1)
     {
        return 'ONE';
     }

     if(data == 2)
     {
        return 'TWO';
     }

     if(data == 3)
     {
        return 'THREE';
     }

     if(data == 4)
     {
        return 'FOUR';
     }
  }

  hitOFFSwitch(data: any): any {
    
    let tempurl = this.urlForApi + '/pin=ON'+this.getDataFromUrl(data);

    if (!data) {
      return Observable.of(data);
    } else {
      return this.http.get(tempurl);
    }
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        dismissOnPageChange:true,
        duration:15000
      });
    this.loading.present();
  }

  setAlarm(data: any)
  {
      

      return Observable.create( (observer: any) => {

            let indiatime: any = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
            let indiatimedate: any  = new Date(indiatime);
            let indiatimeinmiliseconds: any = indiatimedate.getTime();

            
            let usersetalarmdate: any  = new Date(data.usersetdatetime);
            
            

            let usersetalarmdatemiliseconds: any = usersetalarmdate.getTime();
            let differencetosetalarmfromnow: any = usersetalarmdatemiliseconds - indiatimeinmiliseconds;
            let phonetime:any = new Date();
           
            let phonetimeinmiliseconds: any = phonetime.getTime();
            let finaltimetosetalarm: any = phonetimeinmiliseconds + differencetosetalarmfromnow;

            let idforalarm:any = Math.floor(Math.random() * 200);
         
            let pointer: any = this;

                   

                               data.dataoset.timestamp = new Date(finaltimetosetalarm);

                            

                              //schedule notification new
                              pointer.localNotifications.schedule({
                                 id: idforalarm,  
                                 title: data.title,  
                                 text: data.desciption,
                                 sound: data.soundfile,
                                 at: new Date(finaltimetosetalarm),
                                 led: 'FF0000',
                                 data: data.dataoset
                              });

                               let res = { resposerecieved: 'false', errordescription: 'error' };
                               observer.next(res);
                               observer.complete();
                           
                 
            
                      
         }); //observable ends here

      
    }

  
  getAlarm()
  {
    return Observable.create( (observer: any) => {
   
          this.localNotifications.getAll().then((notifications: any) => {
   
             let res = { resposerecieved: 'true', data: notifications };
             observer.next(res);
             observer.complete();

          
   
          });
    });      

  }  
/*

  setAlarm(data: any)
  {
      

      return Observable.create( (observer: any) => {

            let indiatime: any = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
            let indiatimedate: any  = new Date(indiatime);
            let indiatimeinmiliseconds: any = indiatimedate.getTime();

            
            let usersetalarmdate: any  = new Date(data.usersetdatetime);
            
            

            let usersetalarmdatemiliseconds: any = usersetalarmdate.getTime();
            let differencetosetalarmfromnow: any = usersetalarmdatemiliseconds - indiatimeinmiliseconds;
            let phonetime:any = new Date();
           

            let phonetimeinmiliseconds: any = phonetime.getTime();
            let finaltimetosetalarm: any = phonetimeinmiliseconds + differencetosetalarmfromnow;

            

            let idforalarm:any = Math.floor(Math.random() * 20);
         
            let pointer: any = this;

            //get all notification
                    this.localNotifications.getAll().then((notifications: any) => {
                       
                           let donotdothis: boolean = false; 

                           if(donotdothis && notifications.length > 0)
                           {
                                 
                                 let notificationset: boolean = false;
                                 let presentnotificationinloop: any;
                                 let presentnotificationdata: any;
                                 let updateddesciption: any;
                                 let differencebetweensetnotificationtimeandnewnotificationtime: any;
                                 let notificationtimestoredinnotification: any;
                                 let milisecondsforstoretimestamp: any;
                                 let datatosort: any;
                                 let internaldatasort: any;

                                  for(var i = 0; i < notifications.length; i++)
                                  {
                                            datatosort = JSON.parse(notifications[i].data);
                                            internaldatasort = datatosort.actions;

                                           

                                            notificationtimestoredinnotification = new  Date(internaldatasort[0].timestamp);

                                            milisecondsforstoretimestamp = notificationtimestoredinnotification.getTime();

                                            differencebetweensetnotificationtimeandnewnotificationtime =  finaltimetosetalarm - milisecondsforstoretimestamp;

                                           

                                             if(differencebetweensetnotificationtimeandnewnotificationtime < 60000)
                                             {
                                                
                                                //update this notification with new data
                                                notificationset = true;
                                                presentnotificationinloop = notifications[i];
                                                presentnotificationdata = datatosort;
                                                if(presentnotificationdata.hasOwnProperty("actions"))
                                                { 
                                                  data.dataoset.timestamp = new Date(finaltimetosetalarm);

                                                  presentnotificationdata.actions.push(data.dataoset);  
                                                }

                                                updateddesciption = notifications[i].text + data.desciption;
                                                alert(updateddesciption);



                                                pointer.localNotifications.update({
                                                   id: notifications[i].id, 
                                                   title: data.title,  
                                                   text: updateddesciption,
                                                   sound: data.soundfile,
                                                   at: new Date(finaltimetosetalarm),
                                                   led: 'FF0000',
                                                   data: presentnotificationdata

                                                });

                                                let res = { resposerecieved: 'false', errordescription: 'error' };
                                                observer.next(res);
                                                observer.complete();
                                       
                                             }
                                    } //for loop end

                          
                            
                                  if(!notificationset)
                                  {
                                      
                                      
                                      data.dataoset.timestamp = new Date(finaltimetosetalarm);

                                      //set new notification
                                      pointer.localNotifications.schedule({
                                         id: idforalarm,  
                                         title: data.title,  
                                         text: data.desciption,
                                         at: new Date(finaltimetosetalarm),
                                         sound: data.soundfile,
                                         led: 'FF0000',
                                         data: data.dataoset
                                      });

                                        let res = { resposerecieved: 'false', errordescription: 'error' };
                                        observer.next(res);
                                        observer.complete();
                           

                                  }
                           }
                           else
                           {
                            
                            

                               data.dataoset.timestamp = new Date(finaltimetosetalarm);

                              //schedule notification new
                              pointer.localNotifications.schedule({
                                 id: idforalarm,  
                                 title: data.title,  
                                 text: data.desciption,
                                 sound: data.soundfile,
                                 at: new Date(finaltimetosetalarm),
                                 led: 'FF0000',
                                 data: data.dataoset
                              });

                               let res = { resposerecieved: 'false', errordescription: 'error' };
                               observer.next(res);
                               observer.complete();
                            }
                 
                        }); //get all notification ends

                      
         }); //observable ends here

      
    }

  public registerDevice(credentials: any) { 
  
      // At this point store the credentials to your backend!

      //console.log("i am creating user");
      // At this point store the credentials to your backend!
      return Observable.create( (observer: any) => {
        

        this.parserunas.registerDevice(credentials).then(function(answer: any){ 
          
          if(answer)
          {
            let res = { resposerecieved: 'true' };
            observer.next(res);
            observer.complete();
          }else{
            let res = { resposerecieved: 'false', errordescription: "Not registered" };
            observer.next(res);
            observer.complete();
          }   

        }, function(error: any) {
           //console.log(error); // will be called if getUser fails
           let res = { resposerecieved: 'false', errordescription: error };
           observer.next(res);
           observer.complete();
        });


      });
    
  }*/



  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data.json();

    this.data.tracks = [];

    // loop through each day in the schedule
    this.data.schedule.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each session in the timeline group
        group.sessions.forEach((session: any) => {
          session.speakers = [];
          if (session.speakerNames) {
            session.speakerNames.forEach((speakerName: any) => {
              let speaker = this.data.speakers.find((s: any) => s.name === speakerName);
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }

          if (session.tracks) {
            session.tracks.forEach((track: any) => {
              if (this.data.tracks.indexOf(track) < 0) {
                this.data.tracks.push(track);
              }
            });
          }
        });
      });
    });

    return this.data;
  }

  getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
    return this.load().map((data: any) => {
      let day = data.schedule[dayIndex];
      day.shownSessions = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      day.groups.forEach((group: any) => {
        group.hide = true;

        group.sessions.forEach((session: any) => {
          // check if this session should show or not
          this.filterSession(session, queryWords, excludeTracks, segment);

          if (!session.hide) {
            // if this session is not hidden then this group should show
            group.hide = false;
            day.shownSessions++;
          }
        });

      });

      return day;
    });
  }

  filterSession(session: any, queryWords: string[], excludeTracks: any[], segment: string) {

    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segement is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakers() {
    return this.load().map((data: any) => {
      return data.speakers.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getTracks() {
    return this.load().map((data: any) => {
      return data.tracks.sort();
    });
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }


  

}
