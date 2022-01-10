module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client, con2) {
        if (!interaction.isCommand()) return
        const command = client.slashCmds.get(interaction.commandName)
        if (!command) return

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: false,
            })
        }
    },
}
