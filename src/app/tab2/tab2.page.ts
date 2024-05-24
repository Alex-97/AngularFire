import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent]
})
export class Tab2Page {

  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  constructor() {
    const aCollection = collection(this.firestore, 'room_1');
    this.items$ = collectionData(aCollection);
  }

  async addToList() {
      const aCollection = collection(this.firestore, 'room_1');
      const timestamp = new Date(); // Current date and time
  
      await addDoc(aCollection, {
        author: "Tim",
        text: "TestAlex",
        timestamp: timestamp
      });
  }

}
