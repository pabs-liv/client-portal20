<template>
  <div class="file-uploader-card">
    <div v-if="props.showDocumentTypeSelection" class="document-type-selection">
      <span class="document-type-label">Document type:</span>
      <v-item-group v-model="documentType" mandatory>
        <div class="d-flex">
          <v-item v-slot="{ isSelected, toggle }" value="phi">
            <v-card
              :color="isSelected ? 'primary' : ''"
              class="d-flex align-center px-4 py-2 rounded-pill cursor-pointer mr-2"
              :variant="isSelected ? 'flat' : 'outlined'"
              @click="toggle"
            >
              <span :class="isSelected ? 'text-white' : 'text-primary'">PHI</span>
            </v-card>
          </v-item>
          <v-item v-slot="{ isSelected, toggle }" value="accounting_general">
            <v-card
              :color="isSelected ? 'primary' : ''"
              class="d-flex align-center px-4 py-2 rounded-pill cursor-pointer mr-2"
              :variant="isSelected ? 'flat' : 'outlined'"
              @click="toggle"
            >
              <span :class="isSelected ? 'text-white' : 'text-primary'">Accounting / General</span>
            </v-card>
          </v-item>
          <v-item v-slot="{ isSelected, toggle }" value="accounting_invoice">
            <v-card
              :color="isSelected ? 'primary' : ''"
              class="d-flex align-center px-4 py-2 rounded-pill cursor-pointer mr-2"
              :variant="isSelected ? 'flat' : 'outlined'"
              @click="toggle"
            >
              <span :class="isSelected ? 'text-white' : 'text-primary'">Accounting / Invoice</span>
            </v-card>
          </v-item>
          <v-item v-slot="{ isSelected, toggle }" value="notification_files">
            <v-card
              :color="isSelected ? 'primary' : ''"
              class="d-flex align-center px-4 py-2 rounded-pill cursor-pointer"
              :variant="isSelected ? 'flat' : 'outlined'"
              @click="toggle"
            >
              <span :class="isSelected ? 'text-white' : 'text-primary'">Notification Files</span>
            </v-card>
          </v-item>
        </div>
      </v-item-group>
    </div>

    <div
      class="dropzone"
      :class="{ 'drag-over': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="handleClick"
    >
      <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
      <div class="dropzone-content">
        <img :src="UploadIllustration" alt="Upload Icon" class="upload-icon" />
        <slot name="label">
          <p class="drag-drop-text">Drag and drop or click to <span class="upload-link">upload file</span></p>
          <p class="important-text">
            <span class="important-label">Important:</span> The name of the document you upload will display on the client
            portal. Please carefully check your file name before uploading to avoid
            errors and duplicates.
          </p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UploadIllustration from '@/assets/UploadIllustration.png';

interface Props {
  showDocumentTypeSelection?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDocumentTypeSelection: true,
});

const emit = defineEmits<{
  (e: 'file-selected', filename: string): void;
}>();

const documentType = ref('phi');
const isDragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleDragOver = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  if (event.dataTransfer?.files) {
    handleFiles(event.dataTransfer.files);
  }
};

const handleClick = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    handleFiles(target.files);
  }
};

const handleFiles = (files: FileList) => {
  if (files.length > 0) {
    emit('file-selected', files[0].name);
  }
};
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.file-uploader-card {
  background-color: $color-neutral-white;
  border: none;
  border-radius: 8px;
  padding: 0;
  box-shadow: none;
}

.document-type-selection {
  display: flex;
  align-items: center; // Vertically align items
  margin-bottom: $spacing-large;

  .document-type-label {
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-right: $spacing-medium;
    padding-bottom: $spacing-small;
  }
}

.dropzone {
  border: 3px dashed #0f285b;
  border-radius: 8px;
  padding: $spacing-xlarge;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.drag-over {
    background-color: rgba($color-primary, 0.05);
  }

  .dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .upload-icon {
    width: 180px; // Adjust size as needed
    height: auto;
    margin-bottom: $spacing-medium;
  }

  .drag-drop-text {
    font-size: $font-size-body;
    color: $color-text-primary;
    margin-bottom: $spacing-small;

    .upload-link {
      color: $color-link;
      font-weight: $font-weight-semibold;
      text-decoration: underline;
    }
  }

  .important-text {
    font-size: $font-size-small;
    color: $color-text-primary;
    max-width: 400px;
    margin: 0 auto;

    .important-label {
      color: $color-error;
      font-weight: $font-weight-bold;
    }
  }
}
</style>