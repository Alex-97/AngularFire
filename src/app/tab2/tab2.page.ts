import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Settings } from './settings';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatMessage } from './../chatMessage';




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ExploreContainerComponent]
})
export class Tab2Page implements OnInit {

	firestore: Firestore = inject(Firestore);
	items$: Observable<any[]>;
  
  settings: Settings = {} as Settings;
	databaseName :string = 'room_1';
  constructor() { 
		const aCollection = collection(this.firestore, this.databaseName);
		this.items$ = collectionData(aCollection); 
  }

  ngOnInit() {
    this.loadData();
  }
  loadData() : void{
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      this.settings = JSON.parse(storedSettings);
    }else{
      this.loadDefaultData();
    }
  }
	loadDefaultData(): void {
    this.settings = {
      name: "",
      //color: "#FFFFFF"
    };
    this.saveToLocalStorage();
	}
  async isNameUnique(name: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.items$.subscribe((items) => {
        const isUnique = !items.some(item => item.author === name);
        resolve(isUnique);
      });
    });
  }

  async saveToLocalStorage(): Promise<void> {
    if (await this.isNameUnique(this.settings.name)) {
      localStorage.setItem('settings', JSON.stringify(this.settings));
    } else {
      
      const nameInput = document.getElementById('nameInputID');
      console.log(nameInput);
      if (nameInput) {
        nameInput.classList.add('ion-invalid');
        nameInput.classList.add('ion-touched');
      }
      console.error('Name is not unique, not saving to local storage');
    }
  }

}