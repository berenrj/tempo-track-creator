<template>
  <HeaderComponent></HeaderComponent>

  <div class="content content1">
    <h5>How to Use:</h5>
    <p>The form below can be used to create an exportable (pdf) document of a tempo track, that can be used as a song structure reference, or a handy aid when creating the click track for your own music in a DAW.</p>
    <p>Add a new section, or remove the last added section/s using the 'Add Section'/'Remove Section' buttons ('Remove Section' is disabled by default until more than one section is added). Once section/s have been filled out as necessary, to preview the document, click the 'Preview' button underneath the song. To export the document as a pdf, click 'Export PDF'.</p>
  </div>

  <SongComponent>
    <SectionComponent></SectionComponent>
    
  </SongComponent>

  <FooterComponent></FooterComponent>

</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import SongComponent from './components/SongComponent.vue'
import SectionComponent from './components/SectionComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    SongComponent,
    SectionComponent,
    FooterComponent
  }
}
</script>