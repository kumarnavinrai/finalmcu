import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';


import { SwitchesOptions } from '../../interfaces/user-options';

import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-editinfo',
  templateUrl: 'editinfo.html'
})
export class EditinfoPage {
  switches: SwitchesOptions = { switch1: '', switch2: '', switch3: '', switch4: '', switch5: '', switch6: '', switch7: '', switch8: '' };
  submitted = false;

  switchonetext: any = 'Switch One';
  switchtwotext: any = 'Switch Two';
  switchthreetext: any = 'Switch Three';
  switchfourtext: any = 'Switch Four';
  switchfivetext: any = 'Switch Five';
  switchsixtext: any = 'Switch Six';
  switchseventext: any = 'Switch Seven';
  switcheighttext: any = 'Switch Eight';

  msg: any = '';
  
  constructor(public navCtrl: NavController, public userData: UserData, public storage: Storage) 
  {

    this.getData();
  }

  getData()
  {
     this.storage.get('switchonetext').then((value) => {
         
          this.switchonetext = value;
          this.switches.switch1 = value;
      });

      this.storage.get('switchtwotext').then((value) => {
          this.switchtwotext = value;
          this.switches.switch2 = value;
      });

      this.storage.get('switchthreetext').then((value) => {
          this.switchthreetext = value;
          this.switches.switch3 = value;
      });

      this.storage.get('switchfourtext').then((value) => {
          this.switchfourtext = value;
          this.switches.switch4 = value;
      });

      this.storage.get('switchfivetext').then((value) => {
          this.switchfivetext = value;
          this.switches.switch5 = value;
      });

      this.storage.get('switchsixtext').then((value) => {
          this.switchsixtext = value;
          this.switches.switch6 = value;
      });

      this.storage.get('switchseventext').then((value) => {
          this.switchseventext = value;
          this.switches.switch7 = value;
      });

      this.storage.get('switcheighttext').then((value) => {
          this.switcheighttext = value;
          this.switches.switch8 = value;
      });
  }

  onSave(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.storage.set('switchonetext',this.switches.switch1);
      this.storage.set('switchtwotext',this.switches.switch2);
      this.storage.set('switchthreetext',this.switches.switch3);
      this.storage.set('switchfourtext',this.switches.switch4);
      this.storage.set('switchfivetext',this.switches.switch5);
      this.storage.set('switchsixtext',this.switches.switch6);
      this.storage.set('switchseventext',this.switches.switch7);
      this.storage.set('switcheighttext',this.switches.switch8);
      this.msg = 'Successfully saved';
    }
  }
}
