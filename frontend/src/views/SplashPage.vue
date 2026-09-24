<template>
  <div class="splash-page">
    <div class="splash-card">
      <img src="/icons/Logo.svg" alt="Client Portal Logo" class="splash-logo" />

      <h1 class="splash-title">We've just relaunched the Client Portal!</h1>
      <p class="splash-subtitle">Here's what's new:</p>

      <ul class="splash-features">
        <li v-for="feature in features" :key="feature.title" class="splash-feature">
          <component :is="feature.icon" :size="20" :stroke-width="1.5" class="splash-feature-icon" />
          <div class="splash-feature-text">
            <span class="splash-feature-title">{{ feature.title }}</span>
            <span class="splash-feature-desc"> — {{ feature.description }}</span>
          </div>
        </li>
      </ul>

      <Button variant="primary" label="Continue to login" class="splash-continue-btn" @click="onContinue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { LayoutPanelLeft, LayoutDashboard, Filter, Zap } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';

const router = useRouter();

const features = [
  {
    icon: LayoutPanelLeft,
    title: 'Redesigned interface',
    description: 'a cleaner, modernized look and feel',
  },
  {
    icon: LayoutDashboard,
    title: 'New dashboard',
    description: 'key metrics and insights at a glance, right when you log in',
  },
  {
    icon: Filter,
    title: 'Smarter navigation',
    description: 'more filters and tools to help you find what you need, faster',
  },
  {
    icon: Zap,
    title: 'Built for speed',
    description: 'no more waiting around for pages to load',
  },
];

function onContinue() {
  router.push('/login');
}
</script>

<style lang="scss" scoped>
@import '@/style.scss';

.splash-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  padding: $spacing-large;
}

.splash-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  width: 100%;
  background: $color-neutral-white;
  border: 1px solid $color-border;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  padding: $spacing-xlarge $spacing-large;
  text-align: center;
}

.splash-logo {
  max-width: 200px;
  height: auto;
  margin-bottom: $spacing-medium;
}

.splash-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $color-text-primary;
  margin: 0 0 $spacing-nano;
}

.splash-subtitle {
  font-size: $font-size-small;
  color: $color-text-secondary;
  margin: 0 0 $spacing-medium;
}

.splash-features {
  width: 100%;
  list-style: none;
  margin: 0 0 $spacing-large;
  padding: 0;
  text-align: left;
}

.splash-feature {
  display: flex;
  align-items: flex-start;
  gap: $spacing-small;
  padding: $spacing-small 0;
  border-bottom: 1px solid $color-border;

  &:last-child {
    border-bottom: none;
  }
}

.splash-feature-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: $color-primary;
}

.splash-feature-text {
  font-size: $font-size-small;
}

.splash-feature-title {
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.splash-feature-desc {
  color: $color-text-secondary;
}

.splash-continue-btn {
  width: 100%;
}
</style>
