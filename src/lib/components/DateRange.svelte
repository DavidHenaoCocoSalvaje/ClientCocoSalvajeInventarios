<script lang="ts">
    interface Props {
        start_date: string;
        end_date: string;
    }
    
    let { start_date, end_date }: Props = $props();

</script>

<div>
    <label for="start_date" class="mr-2">Desde:</label>
    <input
        type="date"
        id="start_date"
        name="start_date"
        class="box-border rounded-md border px-2"
        bind:value={start_date}
        required />
</div>
<div>
    <label for="end_date" class="mr-2">Hasta:</label>
    <input
        type="date"
        id="end_date"
        name="end_date"
        class="box-border rounded-md border px-2"
        bind:value={end_date}
        required />
</div>