<template>
  <q-page class="flex flex-center bg-primary">
    <q-card
      style="width: 300px; height: auto; display: flex; flex-direction: column; align-items: center"
    >
      <q-img src="../assets/logo.png" ratio="1" width="200px" />

      <q-card-section class="q-pt-none full-width">
        <q-input filled v-model="login.email" label="Email" />
        <q-input class="q-mt-sm" v-model="login.password" filled label="Password" :type="login.isPwd ? 'password' : 'text'">
        <template v-slot:append>
          <q-icon
            :name="login.isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="login.isPwd = !login.isPwd"
          />
        </template>
      </q-input>
      </q-card-section>
      <q-card-actions class="full-width">
        <!-- <q-btn class="q-mx-sm" color="primary" label="Login" @click="$router.push({ name: 'home' })" style="width: 100%"/> -->
        <q-btn class="q-mx-sm" color="primary" label="Login" @click="enviarFormulario()" style="width: 100%"/>
      </q-card-actions>
      <q-card-actions class="full-width">
        <q-btn flat no-caps class="q-mx-sm" color="primary" label="Esqueci minha senha" @click="$router.push({ name: 'esqueciSenha' })" style="width: 100%"/>
      </q-card-actions>
      <q-card-actions class="full-width">
        <q-btn flat no-caps class="q-mx-sm" color="primary" label="Send Message WebSocket" @click="sendMessage('Hellow WebSocket Client Quasar')" style="width: 100%"/>
      </q-card-actions>
    </q-card>

    <q-card class="my-card">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" basic>
        <div class="absolute-bottom text-subtitle2 text-center">
          Title
        </div>
      </q-img>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  name: 'PageIndex',
  created () {
    // console.log('Starting Connection to WebSocket Server...')
    this.connection = new WebSocket('ws://localhost:3000?token=123456')

    this.connection.onopen = (event) => {
      console.log(event)
      console.log('Successfully connected to the echo WebSocket Server')
    }

    this.connection.onmessage = (event) => {
      console.log(event)
    }
  },
  beforeMount () {
    // localStorage.setItem('email', 'admin')
    // localStorage.setItem('password', 'amdin')
  },
  setup () {
    const $q = useQuasar()

    return {
      triggerPositive () {
        $q.notify({
          type: 'positive',
          message: 'Login realizado com sucesso!'
        })
      },
      triggerNegative () {
        $q.notify({
          type: 'negative',
          message: 'Falha no login, verifique o email e senha se estão corretos!'
        })
      },
      triggerWarning () {
        $q.notify({
          type: 'warning',
          message: 'Falha no login, verifique o email e senha se estão corretos!'
        })
      },
      triggerInfo () {
        $q.notify({
          type: 'info',
          message: 'Falha no login, verifique o email e senha se estão corretos!'
        })
      }
    }
  },
  data () {
    return {
      login: {
        email: '',
        password: '',
        isPwd: true,
        connection: null
      }
    }
  },
  components: {
    // GoogleLogin
  },
  methods: {
    enviarFormulario () {
      // validacao futura
      // GET para uma rota em API
      // localStorage.setItem('email', this.login.email)
      // localStorage.setItem('password', this.login.password)
      // console.log(localStorage.getItem('email'))
      // console.log(localStorage.getItem('password'))

      if (this.login.email.toLocaleLowerCase().trim() === 'admin' && this.login.password.toLocaleLowerCase().trim() === 'admin') {
        localStorage.setItem('AUTENTICADO', true)
        this.$router.push({ name: 'home' })
      } else {
        this.triggerNegative()
      }
    },
    onSuccess (googleUser) {
      console.log(googleUser)
      console.log(googleUser.getBasicProfile())
    },
    sendMessage (message) {
      console.log(this.connection)
      this.connection.send(message)
    }
  }
}
</script>
