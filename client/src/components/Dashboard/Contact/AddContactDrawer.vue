<template>
  <v-dialog v-model="isOpen" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">Add New Contact</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDrawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="contactData.name"
            label="Name"
            :rules="[rules.required]"
            required
          />
          <v-text-field
            v-model="contactData.title"
            label="Title"
          />
          <v-text-field
            v-model="contactData.company"
            label="Company"
            :rules="[rules.required]"
            required
          />
          <v-text-field
            v-model="contactData.department"
            label="Department"
          />
          <v-switch
            v-model="contactData.is_active"
            label="Active"
          />
          <v-text-field
            v-model="contactData.image"
            label="Image URL"
            placeholder="Optional"
          />
          <v-textarea
            v-model="contactData.emails"
            label="Emails (comma separated)"
            placeholder="e.g. email@example.com, email2@example.com"
          />
          <v-textarea
            v-model="contactData.phones"
            label="Phones (comma separated)"
            placeholder="e.g. +1234567890, +0987654321"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="submitContact" :disabled="!valid">Save</v-btn>
        <v-btn text @click="closeDrawer">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import { useToast } from 'vue-toastification'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const contactsStore = useContactsStore()
const toast = useToast()

const contactData = ref({
  name: '',
  title: '',
  company: '',
  department: '',
  is_active: true,
  image: '',
  emails: '',
  phones: '',
})

const valid = ref(false)

const rules = {
  required: value => !!value || 'Required.',
}

const closeDrawer = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  contactData.value = {
    name: '',
    title: '',
    company: '',
    department: '',
    is_active: true,
    image: '',
    emails: '',
    phones: '',
  }
}

const submitContact = async () => {
  if (valid.value) {
    const emailsArray = contactData.value.emails.split(',').map(email => email.trim())
    const phonesArray = contactData.value.phones.split(',').map(phone => phone.trim())
    
    const newContact = {
      ...contactData.value,
      emails: emailsArray,
      phones: phonesArray,
    }

    try {
      await contactsStore.createContact(newContact)
      toast.success('Contact added successfully!')
      closeDrawer()
    } catch (error) {
      toast.error('Failed to add contact: ' + error.message)
    }
  }
}
</script>

<style scoped>
</style>