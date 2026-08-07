import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface StoredDocument {
  id: number;
  documentName: string;
  type: string;
  uploadDate: string;
  lastModifiedBy: string;
  status: string;
  category: string;
}

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref<StoredDocument[]>([]);

  function addDocument(doc: Omit<StoredDocument, 'id'>) {
    documents.value.push({ id: Date.now() + Math.floor(Math.random() * 1000), ...doc });
  }

  return { documents, addDocument };
});
