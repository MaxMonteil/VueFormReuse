import Vue from 'vue'
import Vuex from 'vuex'

import { checkStorage, saveToStorage } from './api/localStorageService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [],
    completed: [],
    dataFields: ['todos', 'completed']
  },
  mutations: {
    setState (state, { field, data }) {
      Vue.set(state, field, data)
    },
    addTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    deleteTodo (state, { todoIndex, isCompleted }) {
      if (isCompleted) {
        state.completed.splice(todoIndex, 1)
      } else {
        state.todos.splice(todoIndex, 1)
      }
    },
    completeTodo (state, todoIndex) {
      state.completed.push(state.todos.splice(todoIndex, 1)[0])
    }
  },
  actions: {
    addTodo ({ commit, dispatch }, newTodo) {
      commit('addTodo', newTodo)
      dispatch('saveTodos')
    },
    deleteTodo ({ commit, dispatch }, todoInfo) {
      commit('deleteTodo', todoInfo)
      dispatch('saveTodos')
    },
    completeTodo ({ commit, dispatch }, todoIndex) {
      commit('completeTodo', todoIndex)
      dispatch('saveTodos')
    },
    checkStorage ({ state, commit }) {
      state.dataFields.forEach(field => {
        try {
          commit('setState', {
            field,
            data: checkStorage(field) })
        } catch (e) {
          // The value in storage was invalid or corrupt so just set it to blank
          commit('setState', { field, data: [] })
        }
      })
    },
    saveTodos ({ state }) {
      state.dataFields.forEach(field => saveToStorage(field, state[field]))
    }
  }
})
