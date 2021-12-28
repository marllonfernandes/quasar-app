<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff">
      <q-header elevated class="bg-primary">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu"/>
          <q-toolbar-title>App</q-toolbar-title>
          <!-- <q-btn flat round dense icon="fas fa-sign-out-alt" @click="logout()">
            <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
              Sair
            </q-tooltip>
          </q-btn>-->
          <q-btn flat round dense icon="fas fa-cog">
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Settings</div>
                  <q-toggle v-model="mobileData" label="Use Mobile Data"/>
                  <q-toggle v-model="bluetooth" label="Bluetooth"/>
                </div>
                <q-separator vertical inset class="q-mx-lg"/>
                <div class="column items-center">
                  <q-avatar size="60px">
                    <img src="../assets/marllon_3_4.jpg">
                  </q-avatar>
                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{ emailLogin }}</div>
                  <q-btn
                    color="primary"
                    label="Logout"
                    push
                    size="sm"
                    v-close-popup
                    @click="logout()"
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        mini-to-overlay
        :width="200"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <q-list padding>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="inbox"/>
              </q-item-section>
              <q-item-section>Inbox</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="star"/>
              </q-item-section>
              <q-item-section>Star</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="send"/>
              </q-item-section>
              <q-item-section>Send</q-item-section>
            </q-item>
            <q-separator/>
            <q-item active clickable @click="logout()">
              <q-item-section avatar>
                <q-icon name="fas fa-sign-out-alt"/>
              </q-item-section>
              <q-item-section>Sair</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <q-page-container>
        <q-page padding>
          <div class="row">
            <div class="col-12">
              <q-table
                title="Aplicações"
                :rows="rows"
                :columns="columns"
                row-key="name"
                :separator="separator"
                :visible-columns="visibleColumns"
                :grid="false"
              >
                <template v-slot:top>
                  <img
                  style="height: 50px; width: 50px"
                  src="../assets/monitoring.png">
                  <p class="text-subtitle1" style="padding-left:10px">
                    Monitoramento
                    <q-badge outline color="primary" label="update every 5 seconds" align="top" />
                  </p>
                  <q-space/>
                  <q-select
                    v-model="visibleColumns"
                    multiple
                    outlined
                    dense
                    options-dense
                    :display-value="$q.lang.table.columns"
                    emit-value
                    map-options
                    :options="columns"
                    option-value="name"
                    options-cover
                    style="min-width: 150px"
                  />
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="name" :props="props">
                      <div class="text-weight-light">{{ props.row.name }}</div>
                    </q-td>
                    <q-td key="url" :props="props">
                      <div class="text-weight-light">{{ props.row.url }}</div>
                    </q-td>
                    <q-td key="status" :props="props">
                      <q-badge color="accent"
                        class="text-subtitle2"
                      >{{ props.row.status }}</q-badge>
                    </q-td>
                    <q-td key="message" :props="props">
                      <div class="text-weight-light">{{ props.row.message }}</div>
                    </q-td>
                    <q-td key="success" :props="props">
                      <q-badge color="green"
                        class="text-subtitle2"
                      >{{ props.row.success }}</q-badge>
                    </q-td>
                    <q-td key="error" :props="props">
                      <q-badge color="red"
                        class="text-subtitle2"
                      >{{ props.row.error }}</q-badge>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>

const columns = [
  {
    name: 'name',
    required: false,
    label: 'Name',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'url', required: false, align: 'left', label: 'URL', field: 'url', sortable: true },
  { name: 'status', required: false, align: 'left', label: 'Status', field: 'status', sortable: true },
  { name: 'message', required: false, align: 'left', label: 'Message', field: 'message' },
  { name: 'success', required: false, align: 'left', label: 'Success', field: 'success' },
  { name: 'error', required: false, align: 'left', label: 'Failure', field: 'error' }
]

const rows = []

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  data () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      drawer: ref(false),
      miniState: ref(true),
      link: ref('inbox'),
      visibleColumns: ref(['name', 'url', 'status', 'message', 'success', 'error']),
      columns,
      rows,
      connection: null,
      separator: ref('none'),
      mobileData: ref(true),
      bluetooth: ref(true),
      emailLogin: localStorage.getItem('email') || 'Name'
    }
  },
  components: {
  },
  created () {
    this.connection = new WebSocket('ws://localhost:3000?token=123456')

    this.connection.onopen = (event) => {
      // console.log(event)
      // console.log('Successfully connected to the echo WebSocket Server')
    }

    this.connection.onmessage = (event) => {
      const data = [JSON.parse(event.data)]
      for (let i = 0; i < data.length; i++) {
        const el = data[i]
        const posEl = this.rows.findIndex(r => r.name === el.name)
        if (posEl === -1) {
          this.rows.push({ name: el.name, url: el.url, status: el.status, message: el.message, success: el.success, error: el.error })
        } else {
          this.rows[posEl] = el
        }
      }
      // this.rows.push(ramda.mergeAll(this.rows, data))
    }
  },
  methods: {
    logout () {
      // validacao futura
      // GET para uma rota em API
      // localStorage.removeItem('email')
      // localStorage.removeItem('password')
      localStorage.removeItem('AUTENTICADO')
      this.$router.push({ name: 'login' })
    },
    sendMessage (message) {
      console.log(this.connection)
      this.connection.send(message)
    }
  }
})
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>
