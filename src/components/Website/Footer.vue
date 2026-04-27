<template>
  <footer class="footer-web">
    <v-container>
      <v-row justify="space-between">
        <!-- Brand Section -->
        <v-col cols="12" md="3" class="brand-section">
          <div class="brand">
            <div class="d-flex align-center mb-2">
              <img class="logo" alt="Ultra Tech" src="/white-logo.png" width="40" />
              <div class="line-height-2">
                <h2 class="text-xl font-weight-bold pa-0 text-white mb-0">
                  {{ $t('website.footer.brandName') }}
                </h2>
              </div>
            </div>
            <p class="brand-description">
              {{ $t('website.footer.description') }} <br />
              {{ $t('website.footer.descriptionLine2') }}
            </p>

            <div class="social-icons">
              <a target="_blank" href="https://www.tiktok.com/@ultratech.ut?_r=1&_t=ZS-91fjBAIYuCw"><v-img class="mt-2"
                  width="25" src="/logos/tiktok.png"></v-img></a>
              <a target="_blank" href="https://www.linkedin.com/company/ultra-tech1/"><v-icon>mdi-linkedin</v-icon></a>
              <a target="_blank"
                href="https://www.facebook.com/share/1Aqvwfssxx/?mibextid=wwXIfr"><v-icon>mdi-facebook-messenger</v-icon></a>
              <a target="_blank"
                href="https://www.instagram.com/ultratech.ut?igsh=ejR3MHV6ZW0yaXVr&utm_source=qr"><v-icon>mdi-instagram</v-icon></a>
            </div>
          </div>
        </v-col>

        <v-col cols="6">
          <v-row justify="end">
            <!-- Cards Links -->
            <v-col cols="12" sm="6" md="4" lg="4" class="links-section">
              <h4 class="section-title">{{ $t('website.footer.quick.title') }}</h4>
              <ul class="footer-links">
                <li><router-link to="/about">{{ $t('website.footer.quick.about') }}</router-link></li>
                <li><router-link to="/contact">{{ $t('website.footer.quick.contact') }}</router-link></li>
                <li><router-link to="/cards">{{ $t('website.footer.quick.cards') }}</router-link></li>
                <li><router-link to="/privacy">{{ $t('website.footer.quick.privacy') }}</router-link></li>
                <li><router-link to="/terms">{{ $t('website.footer.quick.terms') }}</router-link></li>
              </ul>
            </v-col>

            <!-- Contact Links -->
            <v-col cols="12" sm="6" md="4" lg="4" class="links-section">
              <h4 class="section-title">{{ $t('website.footer.contact.title') }}</h4>
              <ul class="footer-links">
                <li><a dir="ltr" href="mailto:support@ultratech.co.il">support@ultratech.co.il</a></li>
                <li><a dir="ltr" href="tel:+972 50-394-1341">+972 50-394-1341</a></li>
              </ul>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider class="footer-divider"></v-divider>

      <div class="copyright-section">
        <p class="copyright-text">
          {{ $t('website.footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
      </div>
    </v-container>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(90deg, #7b3ff2 0%, #1c0c59 100%);
  color: #fff;
  padding: 80px 0 40px;
  font-family: "Poppins", sans-serif;
}


.brand-description {
  font-size: 14px;
  color: #dcdcdc;
  line-height: 1.6;
  margin-top: 8px;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-icons a {
  color: #fff;
  font-size: 22px;
  transition: opacity 0.3s ease;
}

.social-icons a:hover {
  opacity: 0.7;
}

.section-title {
  color: #33a1fd;
  font-weight: 600;
  margin-bottom: 18px;
  font-size: 16px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #dcdcdc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #33a1fd;
}

.footer-divider {
  border-color: rgba(255, 255, 255, 0.1);
  margin: 50px 0 30px;
}

.copyright-section {
  text-align: center;
}

.copyright-text {
  color: #d0d0d0;
  font-size: 14px;
  margin: 0;
}

/* Responsive */
@media (max-width: 960px) {
  .footer {
    padding: 60px 0 30px;
  }

  .brand-section {
    margin-bottom: 30px;
  }

  .links-section {
    margin-bottom: 20px;
  }
}
</style>
<script setup lang="ts">
</script>
