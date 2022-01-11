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
                :grid="isMobile"
                dense
                :pagination="initialPagination"
              >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-primary"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
                <template v-slot:top>
                  <img
                  style="height: 50px; width: 50px"
                  src="../assets/monitoring.png">
                  <p class="text-subtitle1" style="padding-left:10px">
                    Monitoring
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
                    <q-td auto-width>
                      <q-btn size="sm" color="primary" round dense outline @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'expand_more'" />
                    </q-td>
                    <q-td key="name" :props="props">
                      <div class="text-weight-light">{{ props.row.name }}</div>
                    </q-td>
                    <q-td key="url" :props="props">
                      <div class="text-weight-light">{{ props.row.url }}</div>
                    </q-td>
                    <q-td key="date" :props="props">
                      <div class="text-weight-light">{{ props.row.date }}</div>
                    </q-td>
                    <q-td key="duration" :props="props">
                      <div class="text-weight-light">{{ props.row.duration }}</div>
                    </q-td>
                    <q-td key="method" :props="props">
                      <q-badge :color="getColorMethod(props.row.method)"
                        class="text-subtitle2"
                      >{{ props.row.method }}</q-badge>
                    </q-td>
                    <q-td key="statuscode" :props="props">
                      <q-badge :color="getColorStatusCode(props.row.statuscode)"
                        class="text-subtitle2"
                      >{{ props.row.statuscode }}</q-badge>
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                      <div class="text-left text-subtitle2 q-pa-lg">
                        <div class="row justify-center">
                          <div class="col-12 q-pl-lg">
                            <!-- Log: {{ props.row.log }} -->
                            <q-table
                              :rows="props.row.log"
                              :columns="columnsLog"
                              row-key="name"
                              dense
                              :separator="separatorLog"
                              :pagination="initialPaginationLog"
                              :filter="filter"
                              :grid="isMobile"
                            >
                              <template v-slot:top-left>
                                <div class="q-pa-md q-gutter-md">
                                  <div>
                                    <q-chip>
                                      <q-avatar color="accent" text-color="white" font-size="09px" size="35px">
                                        {{ props.row.log.length }}
                                      </q-avatar>
                                      Total Rows
                                    </q-chip>
                                    <q-chip>
                                      <q-avatar color="positive" text-color="white" font-size="09px" size="35px">
                                        {{ props.row.log.filter(el => el.statuscode === 200 || el.statuscode === 201 || el.statuscode === 204).length || 0 }}
                                      </q-avatar>
                                      Total Success
                                    </q-chip>
                                    <q-chip>
                                      <q-avatar color="red" text-color="white" font-size="09px" size="35px">
                                        {{ props.row.log.filter(el => el.statuscode !== 200 & el.statuscode !== 201 & el.statuscode !== 204).length || 0 }}
                                      </q-avatar>
                                      Total Failure
                                    </q-chip>
                                  </div>

                                </div>
                              </template>

                              <template v-slot:top-right>
                                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search...">
                                  <template v-slot:append>
                                    <q-icon name="search" />
                                  </template>
                                </q-input>
                              </template>
                              <template v-slot:header="props">
                                <q-tr :props="props">
                                  <q-th
                                    v-for="col in props.cols"
                                    :key="col.name"
                                    :props="props"
                                    class="text-primary"
                                  >
                                    {{ col.label }}
                                  </q-th>
                                </q-tr>
                              </template>
                              <template v-slot:body="props">
                                <q-tr :props="props">
                                  <q-td key="statuscode" :props="props">
                                    <q-badge :color="getColorStatusCode(props.row.statuscode)"
                                      class="text-subtitle2"
                                    >{{ props.row.statuscode }}</q-badge>
                                  </q-td>
                                  <q-td key="message" :props="props">
                                    <div class="text-weight-light">{{ props.row.message }}</div>
                                  </q-td>
                                  <q-td key="date" :props="props">
                                    <div class="text-weight-light">{{ props.row.date }}</div>
                                  </q-td>
                                  <q-td key="duration" :props="props">
                                    <div class="text-weight-light">{{ props.row.duration }}</div>
                                  </q-td>
                                </q-tr>
                              </template>
                            </q-table>
                          </div>
                        </div>
                      </div>
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
    label: '',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true,
    color: 'primary'
  },
  {
    name: 'name',
    required: false,
    label: 'NAME',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'url', required: false, align: 'left', label: 'URL', field: 'url', sortable: true },
  { name: 'method', required: false, align: 'left', label: 'METHOD', field: 'method', sortable: true },
  { name: 'statuscode', required: false, align: 'left', label: 'STATUS CODE', field: 'statuscode', sortable: true }
]

const columnsLog = [
  {
    name: 'statuscode',
    required: false,
    label: 'STATUS CODE',
    align: 'left',
    field: row => row.statuscode,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'message', required: false, align: 'left', label: 'MESSAGE', field: 'message', sortable: true },
  { name: 'date', required: false, align: 'left', label: 'DATE', field: 'date', sortable: true },
  { name: 'duration', required: false, align: 'left', label: 'DURATION', field: 'duration', sortable: true }
]

const rows = []

import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const $q = useQuasar()

    return {
      triggerNotify (msg) {
        $q.notify({
          type: 'degative',
          // color: 'dark',
          icon: 'warning',
          message: msg
        })
      }
    }
  },
  data () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      drawer: ref(false),
      miniState: ref(true),
      isMobile: navigator.userAgentData.mobile,
      link: ref('inbox'),
      visibleColumns: ref(['name', 'url', 'method', 'statuscode']),
      filter: ref(''),
      columns,
      columnsLog,
      rows,
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 100
        // rowsNumber: xx if getting data from a server
      },
      initialPaginationLog: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      connection: null,
      separator: ref('none'),
      separatorLog: ref('none'),
      mobileData: ref(true),
      bluetooth: ref(true),
      emailLogin: localStorage.getItem('email') || 'Name'
    }
  },
  created () {
    this.connection = new WebSocket('ws://localhost:3000?token=123456')
    this.connection.onopen = (event) => {
      // console.log(event)
      // console.log('Successfully connected to the echo WebSocket Server')
    }
    this.load()
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
    },
    getColorStatusCode (value) {
      if (value === 200 || value === 201 || value === 204) {
        return 'green'
      } else {
        return 'red'
      }
    },
    getColorMethod (value) {
      let color = ''
      switch (value) {
        case 'POST':
          color = 'green'
          break
        case 'DELETE':
          color = 'red'
          break
        case 'PUT':
          color = 'warning'
          break
        case 'PATCH':
          color = 'warning'
          break
        default:
          color = 'primary'
          break
      }
      return color
    },
    updateLog () {
      this.load()
    },
    load () {
      this.connection.onmessage = async (event) => {
        const data = JSON.parse(event.data)

        for (let i = 0; i < data.length; i++) {
          const el = data[i]
          const posEl = this.rows.findIndex(r => r.name === el.name)
          if (posEl === -1) {
            this.rows.push({ name: el.name, url: el.url, date: el.date, method: el.method, statuscode: el.statuscode, log: el.log })
          } else {
            this.rows[posEl] = el
          }
        }
      }
    }
  }
})
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>
