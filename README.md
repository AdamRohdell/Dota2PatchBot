# Dota2PatchBot
A bot for posting patchnotes to a specific channel in discord when a new Dota2 patch is announced on Twitter.

It works using node-fetch to fetch the latest tweets from @Dota2 on twitter and checks if the tweet contains a link to the patch-website. Then it invokes a new message in a dedicated discord channel, containing the new link.
