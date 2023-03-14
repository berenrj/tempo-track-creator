<template>

  <!-- <div class="tapTempo">
    <button type="button" class="tapTempoBtn" v-on:click="tapTempoClicked">Tap Tempo</button>
    <p>Tempo (BPM): {{ timeDiff }}</p>
  </div> -->

  <div class="song"> 
    <form id="songForm" class="songForm" v-on:submit.prevent="handleSubmit">

      <div class="songNameInputRow">
          <label for="songName">Song Name / Working Title: </label>
          <input type="text" id="songName" name="songName" maxLength="80" title="Please enter a song name (80 character limit)." v-model="songName" autofocus required>    
      </div>
 
          <SectionComponent 
          v-for="(section, index) in sections"
          v-model="sections"
          v-bind:section="section"
          v-bind:index="index"
          v-bind:key="section.id"
          v-on:inputUpdated="updateSongData(index, $event)"
          >
          </SectionComponent>

      <div class="addRemoveSectionRow">
        <button type="button" class="addSectionBtn" v-on:click="addNewSection">Add Section</button>
        <button type="button" class="removeSectionBtn" v-on:click="removeLastSection" disabled>Remove Section</button>
      </div>
      
    </form>
  </div>

  <div class="previewExportRow">
    <button type="submit" class="previewBtn" form="songForm" >Preview</button>
    <button type="submit" class="exportBtn" form="songForm" >Export PDF</button>
  </div>

  <PdfPreviewComponent v-if="previewOrExport === 'previewBtn' && validSongSubmitted" v-on:previewCloseClick="resetValidSongSubmitted" :song="song"></PdfPreviewComponent>

</template>

<script>
import SectionComponent from './SectionComponent.vue'
import PdfPreviewComponent from './PdfPreviewComponent.vue'
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default {
    name: 'SongComponent',
    props: {
        //
    },
    components: {
        SectionComponent,
        PdfPreviewComponent
    },
    data() {
      return {
        songName: null,
        sections: [
          {
            id: 1,
            sectionName: null,
            tempo: null,
            beatsPerBar: null,
            beatValue: null,
            numBars: null,
            gradualToNext: false,
            description: null
          }
        ],
        nextSectionId: 2,
        song: {},

        previewOrExport: '',
        validSongSubmitted: false,

        tapTempoActive: false,
        timer: null,
        startClickTime: null,
        endClickTime: null,
        timeDiff: null

      }
    },
    watch: {
      validSongSubmitted(newValue) {
        console.log("validSongSubmitted changed to: "+newValue);
      }
    },
    methods: {
      tapTempoClicked() {
        if (!this.tapTempoActive) {
          this.tapTempoActive = true
          console.log("tapTempo ACTIVE")
          this.timer = setTimeout(this.setTapTempoInactive, 6000);
          // this is the 'startClickTime'
          this.startClickTime = Date.now()
          console.log("startClickTime: "+this.startClickTime)
        } else {
          // tapTempoActive is already true, so this is the 'endClickTime'
          this.endClickTime = Date.now()
          console.log("endClickTime: "+this.endClickTime)
          this.timeDiff = this.getTimeDiff(this.startClickTime, this.endClickTime)
          this.setTapTempoInactive() 
        }
      },
      setTapTempoInactive() {
        console.log("tapTempo INACTIVE")
        this.tapTempoActive = false
        console.log("clearTimeout!") 
        clearTimeout(this.timer)
        console.log("timer variable reset to null!")
        this.timer = null
      },
      getTimeDiff(start, end) {
        if (start !== null && end !== null) {
          // console.log("startClickTime: "+start.toTimeString().split(" ")[0])
          // console.log("endClickTime: "+end.toTimeString().split(" ")[0])
          let bpm = Math.round(60 / ((end - start) / 1000).toFixed(3))
          // console.log("time difference (seconds.milliseconds): "+formatted);
          console.log("time difference (bpm): "+bpm)
          return bpm
        }
      },
      addNewSection() {
        // add a new SectionComponent after the last existing section, update the nextSectionId, update the removeBtnState
        this.sections.push({
          id: this.nextSectionId++
        })
        this.setRemoveBtnState()
        // console.log("SongComponent.vue: addNewSection, ", this.sections, this.nextSectionId)
      },
      removeLastSection() {
        // remove the last SectionComponent added, if there are > 1 sections, update the nextSectionId, update the removeBtnState
        if (this.sections.length > 1) {
          this.sections.pop()
          --this.nextSectionId
        }
        this.setRemoveBtnState()
        // console.log("SongComponent.vue: removeLastSection, ", this.sections, this.nextSectionId)
      },
      setRemoveBtnState() {
        // set the disabled state of the removeSectionBtn, should only be clickable when there are > 1 sections
        const removeSectionBtn = document.getElementsByClassName("removeSectionBtn")[0];
        if (this.sections.length > 1) {
          removeSectionBtn.disabled = false;
        } else {
          removeSectionBtn.disabled = true;
        }
      },
      updateSongData(index, e) {
        // define the this.sections key/values from the emitted input
        this.sections[index].sectionName = e.sectionName;
        this.sections[index].tempo = e.tempo;
        this.sections[index].beatsPerBar = e.beatsPerBar;
        this.sections[index].beatValue = e.beatValue;
        this.sections[index].numBars = e.numBars;
        this.sections[index].gradualToNext = e.gradualToNext;
        this.sections[index].description = e.description;
      },
      setBarPositions() {
        if (Object.keys(this.song).length > 0 && this.song.sections.length > 0) {
          let endBarOfPrev = ''
          for (let i=0; i<this.song.sections.length; i++) {
            // if the section id is 1, set startBar to 1.1.00, 
            // endBar to <1+numBars>.1.00
            if (this.song.sections[i].id === 1) {
              this.song.sections[i].startBar = '1.1.00'
              this.song.sections[i].endBar = (Math.floor(1+parseInt(this.song.sections[i].numBars))).toString() + '.1.00'
              endBarOfPrev = this.song.sections[i].endBar
            } else {
            // endBarOfPrev has been set, set the startBar of this section to that variable,
            // then set this section's actual endBar property to <startBarNum + numBars>.1.00
            // then update endBarOfPrev again to this section's endBar
              this.song.sections[i].startBar = endBarOfPrev
              let startBarNum = parseInt(this.song.sections[i].startBar.slice(0, this.song.sections[i].startBar.indexOf('.1.00')))
              this.song.sections[i].endBar = (Math.floor(startBarNum+parseInt(this.song.sections[i].numBars))).toString() + '.1.00'
              endBarOfPrev = this.song.sections[i].endBar
            }
          }
        }
      },
      handleSubmit(event) {
        console.log("test: "+event.submitter.getAttribute('class'))
        // define single song object
        this.song.songName = (this.songName === null ? '' : this.songName);
        this.song.sections = this.sections;
        // attach the startBar/endBar properties to each section
        this.setBarPositions()
        // set previewOrExport
        this.previewOrExport = event.submitter.getAttribute('class')

        // determine whether to show preview, or export file
        if (this.previewOrExport === 'previewBtn') {
          // set validSongSubmitted true and do nothing else, preview component handles preview
          this.validSongSubmitted = true
        } else if (this.previewOrExport === 'exportBtn') {
          // set validSongSubmitted true and call downloadPdf
          this.validSongSubmitted = true
          this.downloadPdf(this.song.songName)


        }

        // print song object
        console.log("SongComponent.vue: handleSubmit, \n"+`validSongSubmitted: ${this.validSongSubmitted}`+`\nsong:\n ${JSON.stringify(this.song)}`);
      },
      resetValidSongSubmitted() {
        this.validSongSubmitted = false
      },
      downloadPdf(fileName) {
        // console.log(this.song.songName)
        let doc = new jsPDF()

        // set some default document properties
        doc.setDocumentProperties({
            title: this.song.songName,
            subject: "A tempo track PDF generated by Tempo Track Creator.",
            // author: "Anonymous",
            keywords: "tempo-track-creator, generated, pdf",
            creator: "Tempo Track Creator"
        });

        // set the header text to the song name
        let headerText = this.song.songName

        // let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        doc.setTextColor('#000000')
        doc.setFont('helvetica')
        doc.setFontSize(18)

        doc.text(headerText, pageWidth / 2, 10, {
            align: 'center',
        })

        // define the body data
        let sectionRows = []

        for (let i=0; i<this.song.sections.length; i++) {
            let section = this.song.sections[i]
            let nameDesc = section.sectionName + (section.description === '' ? '' : `,\n${section.description}`)
            let row = [
                nameDesc,
                `${section.beatsPerBar} / ${section.beatValue}`,
                section.tempo,
                section.numBars,
                section.startBar,
                section.endBar,
                (section.gradualToNext === false ? 'No' : 'Yes')
            ]
            sectionRows.push(row)
        }

        // create the table
        autoTable(doc, {
            headStyles: {
                font: 'helvetica',
                fontStyle: 'normal',
                fontSize: 13,
                cellWidth: 'auto',
                halign: 'left',
                valign: 'middle',
                cellPadding: 1,
                textColor: '#ffffff',
                fillColor: '#4b4b4b',
                lineColor: '#6a6a6a',
                lineWidth: 0.5,
            },
            bodyStyles: {
                font: 'helvetica',
                fontStyle: 'normal',
                fontSize: 11,
                cellWidth: 'auto',
                halign: 'left',
                valign: 'middle',
                cellPadding: 0.5,
                textColor: '#000000',
                fillColor: '#ffffff',
                lineColor: '#4b4b4b',
                lineWidth: 0.5
            },
            head: [['Section Name,\nDescription', 'Time\nSignature', 'Tempo', 'Bars', 'Start Bar', 'End Bar', 'Gradual\nTransition\nto Next?']],
            body: sectionRows,
            pageBreak: 'avoid'
        })

        // remove any bad characters from the fileName and use result for actual filename
        let docName = fileName.replace(/[/\\?%*:|"<>]/g, '')

        // save (download) the pdf
        doc.save(docName + '.pdf')

      }
    }
}
</script>