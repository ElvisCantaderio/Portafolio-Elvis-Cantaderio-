import { defineStore } from "pinia";
import { ref } from "vue";

import { sitios } from 'src/boot/pouchdb.js'

export const useCardStore = defineStore('cards', () => {
  const approvedCards = ref([])
  const unapprovedCards = ref([])
  async function fetchApprovedCards() {
    sitios
      .allDocs({
        include_docs: true,
        attachments: true
      })
      .then((result) => {
        result
          .rows
          .filter((sitio) => sitio.doc.approved === true)
          .forEach((data) => {
            approvedCards.value.push({
              id: data.id,
              approved: data.doc.approved,
              category: data.doc.category,
              centerName: data.doc.centerName,
              contacts: data.doc.contacts,
              createdBy: data.doc.createBy,
              department: data.doc.department,
              description: data.doc.description,
              descripcion: data.doc.descripcion,
              location: data.doc.location,
              photos: data.doc.photos,
              prices: data.doc.prices,
              ranking: data.doc.ranking,
              schedule: data.doc.schedule,
              services: data.doc.services,
              thumbnail: data.doc.thumbnail,
              phones: data.doc.phones,
              latitude: data.doc.location.latitude,
              longitude: data.doc.location.longitude,
              email: data.doc.createBy.email,
              rankingAverage: data.doc.rankingAverage
            })
          })
      })
      .catch((err) => {
        console.error(err);
      })
  }
  async function fetchUnapprovedCards() {
    sitios
      .allDocs({
        include_docs: true,
        attachments: true
      })
      .then((result) => {
        result
          .rows
          .filter((sitio) => sitio.doc.approved === false)
          .forEach((data) => {
            unapprovedCards.value.push({
              id: data.id,
              approved: data.doc.approved,
              category: data.doc.category,
              centerName: data.doc.centerName,
              contacts: data.doc.contacts,
              createdBy: data.doc.createBy,
              department: data.doc.department,
              description: data.doc.description,
              descripcion: data.doc.descripcion,
              location: data.doc.location,
              photos: data.doc.photos,
              prices: data.doc.prices,
              ranking: data.doc.ranking,
              schedule: data.doc.schedule,
              services: data.doc.services,
              thumbnail: data.doc.thumbnail,
              phones: data.doc.phones,
              latitude: data.doc.location.latitude,
              longitude: data.doc.location.longitude,
              email: data.doc.createBy.email,
              rankingAverage: data.doc.rankingAverage
            })
          })
      })
      .catch((err) => {
        console.error(err);
      })
  }
  return {
    approvedCards,
    unapprovedCards,
    fetchApprovedCards,
    fetchUnapprovedCards
  }
})
