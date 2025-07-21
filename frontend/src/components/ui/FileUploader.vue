<template>
  <div class="file-uploader-card">
    <div v-if="props.showDocumentTypeSelection" class="document-type-selection">
      <span class="document-type-label">Document type:</span>
      <v-radio-group v-model="documentType" inline hide-details class="document-type-radio-group">
        <v-radio label="PHI" value="phi" color="primary"></v-radio>
        <v-radio label="Accounting / General" value="accounting_general" color="primary"></v-radio>
        <v-radio label="Accounting / Invoice" value="accounting_invoice" color="primary"></v-radio>
        <v-radio label="Notification Files" value="notification_files" color="primary" on-icon="mdi-radiobox-marked" off-icon="mdi-radiobox-blank"></v-radio>
      </v-radio-group>
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
        <img src="/icons/upload-placeholder.svg" alt="Upload Icon" class="upload-icon" />
        <p class="drag-drop-text">Drag and drop or click to <span class="upload-link">upload file</span></p>
        <p class="important-text">
          <span class="important-label">Important:</span> The name of the document you upload will display on the client
          portal. Please carefully check your file name before uploading to avoid
          errors and duplicates.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  showDocumentTypeSelection?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDocumentTypeSelection: true,
});

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
  console.log('Selected files:', files);
  // Implement actual file upload logic here
  // e.g., upload to server, display progress, etc.
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
    line-height: 1; // Ensure label itself is aligned if it has its own height
  }

  .document-type-radio-group {
    .v-radio {
      .v-selection-control {
        min-height: unset; // Remove default min-height
        .v-selection-control__input {
          border: 1px solid $color-text-primary; // Add border for visibility
          border-radius: 50%; // Make it circular
          .v-icon {
            color: transparent !important; // Hide default icon
          }
        }
      }
      .v-label {
        line-height: normal; // Ensure label text aligns
      }
      &.v-radio--is-active {
        .v-selection-control__input {
          background-color: $color-primary; // Fill with primary color when active
          border-color: $color-primary; // Change border color when active
          .v-icon {
            color: $color-neutral-white !important; // Set checkmark color to white
          }
        }
      }
    }
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
    width: 120px; // Adjust size as needed
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