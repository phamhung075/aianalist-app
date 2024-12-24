// src/firebase/firebase-repository.service.ts
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class FirebaseRepositoryService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async getDocument(collection: string, documentId: string) {
    const firestore = await this.firebaseService.getFirestore();
    const docRef = firestore.collection(collection).doc(documentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error('Document not found');
    }

    return doc.data();
  }

  async setDocument(collection: string, documentId: string, data: any) {
    const firestore = this.firebaseService.getFirestore();
    await firestore.collection(collection).doc(documentId).set(data);
    return { success: true };
  }

  async deleteDocument(collection: string, documentId: string) {
    const firestore = this.firebaseService.getFirestore();
    await firestore.collection(collection).doc(documentId).delete();
    return { success: true };
  }
}
