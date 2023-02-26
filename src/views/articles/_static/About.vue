<template>
    <ArticleTemplate>
        <ArticleDisplay 
            :article="article"/>
    </ArticleTemplate>
</template>

<script>
import ArticleTemplate from '../components/ArticleTemplate.vue';
import ArticleDisplay from '../components/ArticleDisplay.vue';

export default {
    name: 'About',

    components: {
        ArticleTemplate,
        ArticleDisplay,
    },

    data() {
        return {
            article: [
                {
                    key: 'heading',
                    value: 'About This Page'
                },
                {
                    key: 'summary',
                    value: 'Are you looking for friends in Pokémon GO? trainercodes.net is the best way for finding Trainer Codes of active Pokémon GO Trainers! Why would you need friends in Pokémon GO anyway? Read on to learn about the various cases in which you can benefit from trainercodes.net!'
                },
                {
                    key: 'subheading',
                    value: 'Sometimes you need Pokeacutemon GO Trainer Codes right way. Now! Immediately!'
                },
                {
                    key: 'paragraph',
                    value: 'No problem: trainercodes.net will save you from searching the internet for those Pokémon GO Trainer Codes.\nHere are some benefits:'
                },
                {
                    key: 'sub_subheading',
                    value: 'Easy to use'
                },
                {
                    key: 'paragraph',
                    value: 'Just click on the Trainer Code or icon next to it! The Trainer Code of the Pokémon GO Trainer will be copied to your clipboard and you can paste it right away in the Pokémon GO App!'
                },
                {
                    key: 'sub_subheading',
                    value: 'Continuously updated'
                },
                {
                    key: 'paragraph',
                    value: 'The tables will be updated several times per hour. Just check the update info at the top for the time of the latest update!'
                },
                {
                    key: 'paragraph',
                    value: 'Want some more information? Read below in which cases you would need new Pokémon GO Trainer Codes.'
                },
                {
                    key: 'sub_subheading',
                    value: 'Leveling up'
                },
                {
                    key: 'paragraph',
                    value: 'In order to reach the goal of becoming a Level 40 Pokémon GO Trainer you need to collect XP. One way get those XP and level up is via Friendship Levels: Sending and receiving gifts to / from your Pokémon GO Friends accelerates that process of becoming a Level 40 Pokémon GO Trainer. On your journey of collecting that total of 20 Million XP having multiple reliable friends will help you a great deal!\nSo how many XP do you get from the different Friendship Levels?'
                },
                {
                    key: 'listarray',
                    items: [
                        'Good Friends: 3.000 XP ( = 1 day)',
                        'Great Friends: 10.000 XP ( = 7 days)',
                        'Ultra Friends: 50.000 XP ( = 30 days)',
                        'Best Friends: 100.000 XP ( = 90 days)'
                    ]
                },
                {
                    key: 'paragraph',
                    value: 'In addition, sending gifts to other Pokémon GO Trainers will get you 200 XP per gift.\nSo, get those Pokémon GO Trainer Codes on trainercodes.net and become friends with other Pokémon GO Trainers worldwide, exchange gifts and level up quickly! Just click on the Trainer Code you want to copy or the icon next to it. The Trainer Code is automatically copied to your clipboard and ready to be pasted!'
                },
                {
                    key: 'sub_subheading',
                    value: 'Items'
                },
                {
                    key: 'paragraph',
                    value: 'Receiving gifts from your Pokémon GO Friends is a helpful way of getting important items. Especially Trainers with few Pokémonstops around benefit from the gifts they receive from friends. Are you a Pokémon GO Trainer from a rather rural area?! Then listen up! Because getting Pokémon GO Trainer Codes might be as important as another Pokémonstop 5 blocks away.'
                },
                {
                    key: 'paragraph',
                    value: 'Oftentimes you will receive regular items from gifts like regular Pokémonballs, Potions and Revives. But in the long run it comes in handy to have better items in storage. Especially when you plan a few Raids during Raid Hour or the next Community Day is around the corner it makes sense to restock the amount of better items. Exchanging gifts with other Pokémon GO Trainers will give you a good chance to receive Great Balls and Ultra Balls as well as Super Potions, Hyper Potions, Max Potions and Max Revives.'
                },
                {
                    key: 'paragraph',
                    value: 'Other items you can get from gifts of your Pokémon GO Friends are 7 km Eggs, Berries or Evolution Items. So watch out for those, too! Just click on the Pokémon GO Trainer Code you want to send an invitation to. It will be saved to your clipboard automatically and can easily be pasted! Just give it a try!'
                },
                {
                    key: 'sub_subheading',
                    value: 'Research Tasks'
                },
                {
                    key: 'paragraph',
                    value: 'Remember the recent event in celebration of World Tourism Day? The research tasks of that event laid a strong focus on friendships. Tasks from future events might differ, but last September those tasks included:'
                },
                {
                    key: 'listarray',
                    items: [
                        'Trade a Pokémon caught 10.000 km apart',
                        'Make a new friend',
                        'Send 25 gifts to friends'
                    ]
                },
                {
                    key: 'paragraph',
                    value: 'So, in order for example to accomplish the first task either you or the Pokémon GO Trainer you want to trade with needs a Pokémon that is 10.000 km apart from the location you\'re at. Either one of you travels a lot (Congratulations!) or you just open a gift from a Pokémon GO Friend of another continent and receive a 7 km Egg (of course only when you have a spare spot). The Pokémon that hatches out the 7 km Egg will have the location of the Pokémon GO Friend you received it from. Et voilà! For that matter trainercodes.net will be super helpful because of its clear table layout that lists the Trainer Codes according to the continents the Pokémon GO Trainers come from! With clicking on a Pokémon GO Trainer Code or the icon next to it the Trainer Code will be copied to your clipboard. You just need to paste it in the enter field and there you go!'
                },
                {
                    key: 'paragraph',
                    value: 'While the benefits of easy-to-get Trainer Codes are evident for the second of the above research tasks they will be explained for the last one. Because: Who wouldn\'t like to accomplish a research task that rewards you with a Lapras encounter that has the chance of being shiny? Right?! So just send 25 gifts to 25 friends. Done? No?! Well, we all have some lazy Pokémon GO Trainers in our friends lists that are not that reliable when it comes to opening gifts. But in order for you being able to send gifts, it is crucial that others open the old gifts first.'
                },
                {
                    key: 'paragraph',
                    value: 'With trainercodes.net this problem is not likely to occur again. Just pick some Pokémon GO Trainer Codes from the tables above and send them invitations! The Trainer Codes come from active Pokémon GO Trainers that are likely to accept the invitation you just sent them. Give it a try right now: One click on the Trainer Code you\'d like to send an invitation to or on the icon next to it will copy the Trainer Code to your clipboard. So you just have to paste it in the Trainer Code section in the Pokémon GO App and there you go: You are just a few steps away from your hopefully shiny Lapras encounter (or whichever Pokémon it will be next time)!'
                },
                {
                    key: 'sub_subheading',
                    value: 'About Us'
                },
                {
                    key: 'paragraph',
                    value: 'We are two players from Germany that were just tired of searching the internet for Pokémon GO Trainer Codes when they are needed immediately. This turns out especially exhausting when you are looking for Trainer Codes of Pokémon GO Trainers from specific continents! So we came up with the idea of gathering Trainer Codes in the most clear way possible and ended up building this website!'
                },
                {
                    key: 'paragraph',
                    value: 'With the easy-to-use copy-to-clipboard functionality the Pokémon GO Trainer Codes can be copied and pasted in the most simple way. The tables will be updated several times per hour so that always new Pokémon GO Trainer Codes should be at the top of every table. Just check out the info right at the top of the page to find out when the Pokémon GO Trainer Code tables were updated last. We hope you enjoy our website and find new Trainer Codes right when you need them.'
                },
                {
                    key: 'paragraph',
                    value: 'Spotted your own Trainer Code and want it removed for good? No problem! Just contact us and we will take care of it.'
                },
                {
                    key: '',

                },
                {
                    key: '',

                },
                {
                    key: '',

                },
            ]
        }
    }
}
</script>