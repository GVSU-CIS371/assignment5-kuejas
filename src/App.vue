<template>
  <div>
    <!-- Beverage preview -->
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />

    <!-- Temperature selection -->
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>

    <!-- Base selection -->
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>

    <!-- Syrup selection -->
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>

    <!-- Creamer selection -->
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>

    <!-- Auth row -->
    <div class="auth-row">
      <!-- Before user signs in -->
      <button v-if="!beverageStore.user" @click="withGoogle">
        Sign in with Google
      </button>

      <!-- After user signs in -->
      <div v-else>
        <span class="user-label">
          Signed in as
          {{
            beverageStore.user.displayName || beverageStore.user.email
          }}
        </span>
        <button @click="handleSignOut">Sign out</button>
      </div>
    </div>

    <p class="hint" v-if="!beverageStore.user">
      Please sign in with Google to make and view your saved beverages.
    </p>

    <!-- Beverage name input -->
    <input
      v-model="beverageStore.currentName"
      type="text"
      placeholder="Beverage Name"
    />

    <!-- Make Beverage button (disabled when logged out) -->
    <button
      @click="handleMakeBeverage"
      :disabled="!beverageStore.user"
    >
      🍺 Make Beverage
    </button>

    <!-- Status / error messages -->
    <p v-if="message" class="status-message">
      {{ message }}
    </p>
  </div>

  <!-- Saved beverages list -->
  <div style="margin-top: 20px">
    <div
      v-if="beverageStore.user && beverageStore.beverages.length > 0"
    >
      <p>Saved beverages:</p>
      <template
        v-for="beverage in beverageStore.beverages"
        :key="beverage.id"
      >
        <input
          type="radio"
          :id="beverage.id"
          :value="beverage"
          v-model="beverageStore.currentBeverage"
          @change="beverageStore.showBeverage()"
        />
        <label :for="beverage.id">{{ beverage.name }}</label>
      </template>
    </div>

    <p v-else-if="beverageStore.user">
      No saved beverages yet. Make one to see it here!
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

import { auth, googleProvider } from "./firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const beverageStore = useBeverageStore();
beverageStore.init();

const message = ref("");

const showMessage = (txt: string) => {
  message.value = txt;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

// Listen for login/logout changes from Firebase Auth
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    beverageStore.setUser(user);
  });
});

const withGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    beverageStore.setUser(result.user);

    showMessage("Signed in successfully!");
  } catch (err: any) {
    console.error("Google sign-in error:", err);
    showMessage("Error signing in with Google. Please try again.");
  }
};


const handleSignOut = async () => {
  try {
    await signOut(auth);
    showMessage("Signed out.");
  } catch (err: any) {
    console.error("Sign-out error:", err);
    showMessage("Error signing out. Please try again.");
  }
};

const handleMakeBeverage = () => {
  const txt = beverageStore.makeBeverage();
  showMessage(txt);
};
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}

ul {
  list-style: none;
}

.auth-row {
  margin-top: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-label {
  color: #ffffff;
  font-size: 0.9rem;
}

.hint {
  margin-top: 4px;
  color: #ffffff;
  font-size: 0.85rem;
}

.status-message {
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  font-size: 0.9rem;
}
</style>
