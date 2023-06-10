<template>
    <div class="section">
        <ul class="sectionInputList">
            <li>
                <label for="sectionName">Section Name: </label>
                <input type="text" id="sectionName" name="sectionName" maxLength="80" title="Please enter a section name (80 character limit)." v-model="sectionName" v-on:input="sectionUpdated" required>
            </li>
            <hr>
            <li>
                <label for="tempo">Tempo: </label>
                <input type="number" id="tempo" name="tempo" v-model="tempo" min="1" max="300" title="Please enter a number between 1 and 300 (bpm)." size="4" v-on:input="sectionUpdated" required>
                <label for="beatsPerBar"> Time Sig: </label>
                <input type="number" id="beatsPerBar" name="beatsPerBar" v-model="beatsPerBar" min="1" max="32" step="1" size="3" title="Please enter a number between 1 and 32 (beats per bar)." v-on:input="sectionUpdated" required>
                <label for="beatValue"> / </label>
                <select name="beatValue" id="beatValue" title="Select a beat value." v-model="beatValue" v-on:input="sectionUpdated" required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4" selected="selected">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                </select>
                <label for="numBars"> No. Bars: </label>
                <input type="number" id="numBars" name="numBars" v-model="numBars" min="1" max="128" size="3" title="Please enter a number between 1 and 128." v-on:input="sectionUpdated" required>
            </li>
            <li>
                <label for="gradualToNext">Gradually transition tempo to next section? </label>
                <input type="checkbox" id="gradualToNext" name="gradualToNext" v-model="gradualToNext" value="true" title="Only check this, if this section tempo should transition linearly to the next section tempo (i.e. speeding up/'accelerando', or slowing down/'ritardando')." v-on:input="sectionUpdated">
            </li>
            <li>
                <label for="description">Description: </label>
                <textarea name="description" id="description" v-model="description" cols="50" rows="1" maxLength="200" placeholder="Optional section description (200 character limit) ..." v-on:input="sectionUpdated"></textarea>
            </li>
        </ul>

    </div>
</template>

<script>
export default {
    name: 'SectionComponent',
    props: {
        //
    },
    data() {
        return {
            sectionName: '',
            tempo: '',
            beatsPerBar: '',
            beatValue: '',
            numBars: '',
            gradualToNext: false,
            description: ''
        }
    },
    mounted() {
        // set default section values
        this.sectionName = ''
        this.tempo = ''
        this.beatsPerBar = ''
        this.beatValue = '4'
        this.numBars = ''
        this.gradualToNext = false
        this.description = ''
    },
    methods: {
        sectionUpdated(event) {
            switch(event.target.name) {
                case "sectionName":
                    this.sectionName = event.target.value;
                    break;
                case "tempo":
                    this.tempo = event.target.value;
                    break;
                case "beatsPerBar":
                    this.beatsPerBar = event.target.value;
                    break;
                case "beatValue":
                    this.beatValue = event.target.value;
                    break;
                case "numBars":
                    this.numBars = event.target.value;
                    break;
                case "gradualToNext":
                    this.gradualToNext = event.target.checked;
                    break;
                case "description":
                    this.description = event.target.value;
                    break;
                default:
                    //
            }
            this.$emit("inputUpdated", this);
        }
    }
}
</script>