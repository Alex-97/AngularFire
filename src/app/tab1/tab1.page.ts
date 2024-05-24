import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonInput, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgFor, NgIf, AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonButton, IonInput, IonFooter, AsyncPipe, NgFor, NgIf, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page {
	firestore: Firestore = inject(Firestore);
	items$: Observable<any[]>;
	newMessage: string = '';
	constructor() {
		const aCollection = collection(this.firestore, 'room_1');
		this.items$ = collectionData(aCollection);
		console.log(this.items$);
	}

	async sendNewMessage() {
		const aCollection = collection(this.firestore, 'room_1');
		const timestamp = new Date(); // Current date and time
		return;
		await addDoc(aCollection, {
			author: "Tim",
			text: "TestAlex",
			timestamp: timestamp
		});
	}
}
