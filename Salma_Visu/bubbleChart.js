// Variables globales pour les données et les filtres
let fullData = {};
let filteredData = {};
let initialLoad = true;
const DATA_URL = './preProcessedData/artist_genre_stats.json';
const genresMap = new Map([
    ["classical", [
      "classical","andalusian classical music", "indian classical music", "korean court music", 
      "persian classical music", "ottoman music", "western classical music",
      "early music", "medieval music", "ars antiqua", "ars nova", "ars subtilior",
      "renaissance music", "baroque music", "galant music", "classical period", 
      "romantic music", "20th and 21st-centuries classical music", "modernism", 
      "impressionism", "neoclassicism", "high modernism", "postmodern music", 
      "experimental music", "contemporary classical music", "minimal music", "neoclassical", "modern classical","chamber music" 
    ]],
    ["avant-garde & experimental", [
        "avant-garde", "experimental" ,"avant-garde music", "experimental music", "crossover music", "danger music", 
        "drone music", "electroacoustic", "industrial music", "instrumental", "lo-fi", 
        "musical improvisation", "musique concrète", "noise", "outsider music", 
        "progressive music", "psychedelic music", "underground music","experimental", "experimental pop"
      ]],
      
      ["blues", [
        "blues","african blues", "blues rock", "british blues", "canadian blues", "chicago blues", 
        "classic female blues", "contemporary r&b", "country blues", "delta blues", 
        "desert blues", "detroit blues", "electric blues", "gospel blues", "hill country blues", 
        "hokum blues", "jump blues", "kansas city blues", "louisiana blues", "memphis blues", 
        "new orleans blues", "piedmont blues", "punk blues", "rhythm and blues", "doo-wop", 
        "soul blues", "st. louis blues", "swamp blues", "talking blues", "texas blues", 
        "west coast blues", "dirty blues", "harmonica blues","east coast blues"
      ]],
      
      ["country", [
        "country","alternative country", "americana", "cowpunk", "country-punk", "gothic country", 
        "roots rock", "australian country", "bush band", "bakersfield sound", "bluegrass", 
        "old-time bluegrass", "appalachian bluegrass", "traditional bluegrass", 
        "neo-traditional bluegrass", "progressive bluegrass", "nu-grass", "bluegrass gospel", 
        "blue yodeling", "bro-country", "cajun", "cajun fiddle", "canadian country", 
        "franco-country", "christian country", "classic country", "country and irish", 
        "country blues", "country en español", "country folk", "country pop", "cosmopolitan country", 
        "country rap", "hick-hop", "country rock", "cowboy pop", "dansband", "gulf and western", 
        "hokum", "honky tonk", "instrumental country", "lubbock sound", "nashville sound", 
        "countrypolitan", "neotraditional country", "new country", "old-time", "outlaw country", 
        "pop country", "progressive country", "regional mexican", "rockabilly", "neo-rockabilly", 
        "psychobilly", "punkabilly", "gothabilly", "hellbilly", "southern rock", "southern soul", 
        "sertanejo", "talking blues", "traditional country", "truck-driving country", 
        "western music", "cowboy music", "new mexico music", "red dirt", "tejano", "tex-mex", 
        "texas country", "western swing", "zydeco", "Country pop &#x200e;"
      ]],
      ["easy listening", [
        "easy listening","adult contemporary music", "adult standards", "background music", "elevator music", 
        "barococo", "beautiful music", "chill-out", "downtempo", "furniture music", "light music", 
        "lounge music", "middle of the road", "new-age music", "soft rock"
      ]],
      
      ["electronic", [
        "electronic","ambient", "ambient dub", "dark ambient", "ambient industrial", "dungeon synth", 
        "isolationism", "dreampunk", "illbient", "new-age", "neoclassical new-age", "space music", 
        "bass music", "footwork", "future bass", "kawaii future bass", "jungle terror", "midtempo bass", 
        "trap (edm)", "uk bass", "wave", "hardwave", "breakbeat", "acid breaks", "baltimore club", 
        "jersey club", "philly club", "big beat", "breakbeat hardcore", "darkcore", "hardcore breaks", 
        "broken beat", "florida breaks", "nu skool breaks", "progressive breaks", 
        "psychedelic breakbeat", "chill-out", "downtempo", "psybient", "psydub", "trip hop", 
        "trip rock", "disco", "afro/cosmic music", "electro-disco", "hi-nrg", "eurobeat", "eurodance", 
        "italo dance", "italo disco", "spacesynth", "space disco", "eurodisco", "nu-disco", 
        "post-disco", "boogie", "city pop", "drum and bass", "darkstep", "drumfunk", "drumstep", 
        "hardstep", "intelligent drum and bass", "atmospheric drum and bass", "jazzstep", "jump-up", 
        "liquid funk", "neurofunk", "sambass", "techstep", "dub", "dub poetry", "dubtronica", 
        "electronic rock", "dance-rock", "alternative dance", "baggy", "new rave", "dance-punk", 
        "electronic pop", "dance-pop", "freestyle", "disco polo", "hyperpop", "sophisti-pop", 
        "synth-pop", "electroclash", "electropop", "wonky pop", "indietronica", "krautrock", 
        "new wave", "cold wave", "dark wave", "neoclassical dark wave", "neue deutsche todeskunst", 
        "ethereal wave", "nu-gaze", "minimal wave", "neue deutsche welle", "new romantic", "post-rock", 
        "space rock", "synth-metal", "electrogrind", "electronicore", "synth-punk", "electronica", 
        "folktronica", "livetronica", "laptronica", "nu jazz", "progressive electronic", 
        "berlin school", "kosmische musik", "ethnic electronica", "asian underground", 
        "african electronic dance music", "afrobeats", "azonto", "coupé-décalé", "kuduro", "mahraganat", 
        "shangaan electro", "budots", "changa tuki", "dancehall pop", "denpa music", "guaracha", 
        "funk carioca", "funk melody", "funk ostentação", "proibidão", "rasteirinha", "merenhouse", 
        "nortec", "rabòday", "rara tech", "russ music", "shamstep", "tecnocumbia", "tribal guarachero", 
        "worldbeat", "manila sound", "experimental electronic", "black midi", "deconstructed club", 
        "drone", "electroacoustic music", "acousmatic music", "electroacoustic improvisation", 
        "musique concrète", "soundscape", "glitch", "microsound", "noise music", "danger music", 
        "japanoise", "harsh noise", "harsh noise wall", "power electronics", "death industrial", 
        "power noise", "plunderphonics", "sampledelia", "reductionism", "lowercase", "onkyokei", 
        "funk fusion genres", "acid jazz", "funktronica", "synth-funk", "jungle", "ragga jungle", 
        "hard dance", "hard nrg", "hardstyle", "dubstyle", "euphoric frenchcore", "euphoric hardstyle", 
        "rawstyle", "trapstyle", "jumpstyle", "lento violento", "mákina", "hardcore", "bouncy techno", 
        "breakcore", "raggacore", "digital hardcore", "frenchcore", "gabber", "early hardcore", 
        "mainstream hardcore", "happy hardcore", "uk hardcore", "industrial hardcore", "j-core", 
        "speedcore", "extratone", "flashcore", "splittercore", "hauntology", "chillwave", 
        "hypnagogic pop", "synthwave", "darksynth", "sovietwave", "vaporwave", "future funk", 
        "hardvapour", "mallsoft", "hip hop fusion genres", "afroswing", "alternative hip hop", 
        "hipster hop", "cloud rap", "crunk", "crunkcore", "snap music", "electro", "emo rap", 
        "glitch hop", "instrumental hip hop", "lofi hip hop", "miami bass", "mumble rap", "trap", 
        "afro trap", "drill", "brooklyn drill", "uk drill", "latin trap", "phonk", "drift phonk", 
        "brazilian phonk", "plugg", "uk trap", "house music", "acid house", "afro house", "afro tech", 
        "amapiano", "kidandali", "ambient house", "balearic beat", "ballroom", "bass house", 
        "brazilian bass", "slap house", "blog house", "chicago hard house", "chicago house", 
        "deep house", "disco house", "diva house", "hardbag", "electro house", "big room house", 
        "future rave", "complextro", "dutch house", "fidget house", "melbourne bounce", "electro swing", 
        "eurohouse", "french house", "funky house", "future house", "garage house", "ghetto house", 
        "ghettotech", "juke house", "gqom", "hip house", "electro hop", "italo house", "jackin house", 
        "jazz house", "kwaito", "latin house", "melodic house", "microhouse", "moombahcore", 
        "moombahton", "moombahsoul", "new jersey sound", "outsider house", "lo-fi house", 
        "progressive house", "soulful house", "stadium house", "tech house", "tribal house", 
        "tropical house", "trouse", "uk hard house", "pumping house", "hardbass", "scouse house", 
        "industrial and post-industrial", "electro-industrial", "dark electro", "aggrotech", 
        "electronic body music", "futurepop", "new beat", "industrial hip hop", "industrial metal", 
        "cyber metal", "neue deutsche härte", "industrial rock", "martial industrial", "witch house", 
        "intelligent dance music", "algorave", "drill 'n' bass", "r&b and soul fusion genres", 
        "alternative r&b", "contemporary r&b", "neo soul", "new jack swing", "techno", "acid techno", 
        "ambient techno", "birmingham sound", "bleep techno", "detroit techno", "dub techno", 
        "hard techno", "free tekno", "jungletek", "raggatek", "industrial techno", "minimal techno", 
        "schaffel", "toytown techno", "trance music", "acid trance", "balearic trance", "dream trance", 
        "eurotrance", "hands up", "goa trance", "nitzhonot", "hard trance", "progressive trance", 
        "psychedelic trance", "dark psytrance", "full-on", "minimal psytrance", "progressive psytrance", 
        "suomisaundi", "tech trance", "uplifting trance", "vocal trance", "uk garage", "2-step garage", 
        "bassline", "breakstep", "dubstep", "brostep", "post-dubstep", "reggaestep", "riddim", 
        "future garage", "grime", "grindie", "speed garage", "uk funky", "funkstep", "wonky", 
        "video game music", "chiptune", "bitpop", "skweee", "nintendocore", "fm synthesis", 
        "sequencer music", "edm", "ebm", "industrial", "house", "trance","Synth-pop", "Drum and bass", "Deep house &#x200e;"
      ]],
      ["folk", [
        "folk","american folk revival", "americana", "anti-folk", "british folk revival", 
        "cajun music", "celtic music", "chalga", "corrido", "creole music", "filk", 
        "folk noir", "folk rock", "folktronica", "celtic rock", "freak folk", 
        "indie folk", "industrial folk", "mariachi", "ranchera", "neofolk", 
        "new weird america", "progressive folk", "protest song", "psychedelic folk", 
        "singer-songwriter", "nueva canción", "skiffle", "sung poetry", 
        "tarantella/pizzica", "traditional blues verses", "folk", "irish folk", "italian folk", "contemporary folk", "Indie folk &#x200e;", "Singer-songwriter &#x200e;", "Singer-songwriter"
      ]],
      
      ["hip hop", [
        "hip hop","alternative hip hop", "experimental hip hop", "hipster hop", "boom bap", 
        "bounce", "british hip hop", "road rap", "chopped and screwed", "chopper", 
        "christian hip hop", "cloud rap", "comedy hip hop", "crunk", "crunkcore", 
        "east coast hip hop", "freestyle rap", "funk carioca", "funk ostentação", 
        "frat rap", "g-funk", "hardcore hip hop", "dirty rap", "gangsta rap", 
        "mafioso rap", "horrorcore", "memphis rap", "hyphy", "jerkin'", 
        "instrumental hip hop", "latin hip hop", "chicano rap", "lofi hip hop", 
        "miami bass", "mumble rap", "nerdcore", "chap hop", "political hip hop", 
        "conscious hip hop", "progressive rap", "religious hip hop", "christian hip hop", 
        "jewish hip hop", "snap music", "southern hip hop", "trap music", 
        "drill music", "brooklyn drill", "uk drill", "latin trap", "phonk", 
        "plugg", "pluggnb", "rage", "tread rap", "turntablism", "underground hip hop", 
        "west coast hip hop", "country rap", "electro", "emo rap", "hip hop soul", 
        "neo soul", "hip house", "industrial hip hop", "jazz rap", "new jack swing", 
        "pop rap", "punk rap", "ragga hip hop", "rap opera", "rap rock", 
        "rap metal", "trap metal", "rapcore", "trip hop", "french hip hop", "old school hip hop", "midwestern rap", "urban contemporary", "pop-rap"
      ]],
      
      ["jazz", [
        "jazz","acid jazz", "afro-cuban jazz", "alt-jazz", "avant-garde jazz", "bebop", 
        "big band", "boogie-woogie", "bossa nova", "brazilian jazz", "british dance band", 
        "cape jazz", "chamber jazz", "continental jazz", "cool jazz", "crossover jazz", 
        "dixieland", "ethno jazz", "european free jazz", "free funk", "free improvisation", 
        "free jazz", "gypsy jazz", "hard bop", "jazz blues", "jazz-funk", 
        "jazz fusion", "jazz rap", "jazz rock", "jazztronica", "kansas city jazz", 
        "latin jazz", "livetronica", "m-base", "mainstream jazz", "modal jazz", 
        "neo-bop jazz", "neo-swing", "nu jazz", "orchestral jazz", "post-bop", 
        "progressive jazz", "punk jazz", "samba-jazz", "shibuya-kei", "ska jazz", 
        "smooth jazz", "soul jazz", "straight-ahead jazz", "stride jazz", "swing", 
        "trad jazz", "third stream", "vocal jazz", "west coast jazz", "contemporary jazz", "vocalese", "scat","Jazz-funk"
      ]],
      
      ["pop", [
        "pop","adult contemporary", "adult hits", "alternative pop", "ambient pop", 
        "arabic pop music", "art pop", "avant-pop", "baroque pop", "beach music", 
        "bedroom pop", "brill building", "britpop", "bubblegum pop", "c-pop", 
        "cantopop", "hokkien pop", "mandopop", "canción", "canzone", "chalga", 
        "chamber pop", "chanson", "christian pop", "classic hits", "classical crossover", 
        "contemporary hit radio", "country pop", "cringe pop", "dance-pop", "dark pop", 
        "disco polo", "electropop", "europop", "austropop", "eurobeat", 
        "french pop", "italo dance", "italo disco", "laïkó", "nederpop", 
        "neomelodic music", "nordic popular music", "russian pop", "fado", 
        "folk pop", "hyperpop", "indie pop", "twee pop", "indian pop", 
        "iranian pop", "j-pop", "anime song", "city pop", "shibuya-kei", 
        "jangle pop", "jazz pop", "k-pop", "korean hip hop", "korean rock", 
        "t'ong guitar", "trot", "latin ballad", "latin pop", "mexican pop", 
        "new pop", "new romantic", "oldies", "operatic pop", "opm", 
        "pinoy pop", "pop rap", "pop rock", "pop punk", "emo pop", 
        "neon pop", "power pop", "soft rock", "surf pop", "yacht rock", 
        "pop soul", "progressive pop", "psychedelic pop", "rebetiko", 
        "rhythmic adult contemporary", "rhythmic contemporary", "rhythmic oldies", 
        "schlager", "sophisti-pop", "space age pop", "sunshine pop", "swamp pop", 
        "synth-pop", "teen pop", "traditional pop", "turbo-folk", "turkish pop", 
        "urban adult contemporary", "urban contemporary music", "vispop", 
        "wonky pop", "worldbeat", "yé-yé", "synthpop", "classic pop", "pop-folk","Pop rock &#x200e;", "Neo soul &#x200e;", "Adult alternative &#x200e;"
      ]],
      
      ["r&b & soul", [
        "alternative r&b", "Contemporary r&amp;b", "disco", "freestyle", "go-go", 
        "funk", "deep funk", "minneapolis sound", "psychedelic funk", "synth-funk", 
        "gospel music", "southern gospel", "urban contemporary gospel", "new jack swing", 
        "post-disco", "boogie", "rhythm and blues", "doo-wop", "soul", 
        "blue-eyed soul", "brown-eyed soul", "cinematic soul", "classic soul", 
        "hip hop soul", "neo soul", "northern soul", "progressive soul", 
        "psychedelic soul", "quiet storm", "southern soul"
      ]],
      ["rock", [
        "rock","active rock", "adult album alternative", "adult-oriented rock", "afro rock", 
        "album oriented rock", "alternative rock", "alternative dance", "britpop", 
        "post-britpop", "college rock", "dream pop", "shoegaze", "blackgaze", 
        "grunge", "post-grunge", "soft grunge", "indie rock", "dunedin sound", 
        "kindie rock", "math rock", "midwest emo", "post-punk revival", "slacker rock", 
        "madchester", "baggy", "noise pop", "sadcore", "slowcore", 
        "american rock", "anatolian rock", "arabic rock", "arena rock", "beat", 
        "british invasion", "freakbeat", "mod (subculture)", "nederbeat", 
        "blues rock", "boogie rock", "brazilian rock", "samba rock", 
        "british rhythm and blues", "british rock music", "chamber pop", 
        "chinese rock", "christian rock", "classic alternative", "classic rock", 
        "comedy rock", "country rock", "dark cabaret", "death 'n' roll", 
        "deathrock", "desert rock", "electronic rock", "electroclash", 
        "electronicore", "new wave", "cold wave", "dark wave", "ethereal wave", 
        "emo", "experimental rock", "art rock", "industrial rock", 
        "post-punk", "dance-punk", "dance-rock", "gothic rock", "no wave", 
        "noise rock", "post-rock", "post-metal", "folk rock", 
        "british folk rock", "celtic rock", "medieval folk rock", "funk rock", 
        "garage rock", "proto-punk", "geek rock", "glam rock", "gothic rock", 
        "pagan rock", "hard rock", "heartland rock", "heavy metal", 
        "indian rock", "iranian rock", "instrumental rock", "japanese rock", 
        "jazz fusion", "jazz rock", "korean rock", "latin rock", 
        "chicano rock", "rock en español", "rock music in mexico", "mainstream rock", 
        "mangue bit", "modern rock", "new wave of classic rock", "occult rock", 
        "paisley underground", "pop rock", "jangle pop", "power pop", 
        "soft rock", "yacht rock", "progressive rock", "art rock", 
        "avant-prog", "rock in opposition", "canterbury scene", "flamenco rock", 
        "krautrock", "neo-prog", "new prog", "post-progressive", 
        "progressive rock (radio format)", "proto-prog", "space rock", 
        "symphonic rock", "zeuhl", "psychedelic rock", "acid rock", 
        "freak scene", "neo-psychedelia", "raga rock", "pub rock (australia)", 
        "pub rock (united kingdom)", "punk rock", "rap rock", "rapcore", 
        "reggae rock", "rock and roll", "rockabilly", "gothabilly", 
        "hellbilly", "psychobilly", "rock music in france", "rock opera", 
        "roots rock", "southern rock", "stoner rock", "swamp rock", 
        "sufi rock", "surf rock", "tropical rock", "viking rock", 
        "visual kei", "nagoya kei", "wizard rock", "j-rock", "rock 'n' roll", "southern metal", "dark rock", "andean rock", "swiss rock", "raw rock",    "Shoegazing &#x200f;&#x200e;",
        "Neo-psychedelia &#x200f;&#x200e;","Progressive rock &#x200e;","Progressive rock &#x200f;&#x200e;","Gothic rock &#x200f;&#x200e;","Post-punk &#x200e;","Rock 'n' roll &#x200e;"
      ]],
      
      ["metal", [
        "metal","alternative metal", "funk metal", "nu metal", "rap metal", 
        "avant-garde metal", "drone metal", "post-metal", "black metal", 
        "depressive suicidal black metal", "blackened death metal", 
        "atmospheric black metal", "blackgaze", "melodic black metal", 
        "national socialist black metal", "symphonic black metal", 
        "viking metal", "christian metal", "unblack metal", "death metal", 
        "death 'n' roll", "deathgrind", "melodic death metal", 
        "technical death metal", "brutal death metal", "slam death metal", 
        "doom metal", "death-doom", "stoner-doom", "extreme metal", 
        "folk metal", "celtic metal", "medieval metal", "pagan metal", 
        "glam metal", "gothic metal", "industrial metal", "kawaii metal", 
        "latin metal", "math metal", "metalcore", "deathcore", 
        "mathcore", "melodic metalcore", "progressive metalcore", 
        "neoclassical metal", "neue deutsche härte", "new wave of american heavy metal", 
        "new wave of british heavy metal", "nintendocore", "pirate metal", 
        "pop metal", "power metal", "progressive metal", "djent", 
        "sludge metal", "speed metal", "symphonic metal", "thrash metal", 
        "crossover thrash", "groove metal", "dark metal", "neo-classical metal", "southern metal", "post-thrash", "nsbm","Symphonic metal &#x200e;"
      ]],
      
      ["punk", [
        "punk","afro-punk", "anarcho punk", "crust punk", "d-beat", 
        "art punk", "avant punk", "christian punk", "crust punk", 
        "deathrock", "electropunk", "cyberpunk", "dance-punk", 
        "digital hardcore", "dreampunk", "synth punk", "folk punk", 
        "celtic punk", "cowpunk", "gypsy punk", "scottish gaelic punk", 
        "garage punk", "german punk", "glam punk", "gothic punk", 
        "grindcore", "crustgrind", "electrogrind", "goregrind", 
        "noisegrind", "pornogrind", "hardcore punk", "bardcore", 
        "beatdown hardcore", "christian hardcore", "crabcore", 
        "crunkcore", "electronicore", "krishnacore", "melodic hardcore", 
        "positive hardcore", "post-hardcore", "queercore", "taqwacore", 
        "emo", "emo pop", "screamo", "powerviolence", "street punk", 
        "horror punk", "latino punk", "nazi punk", "oi!", 
        "pop punk", "easycore", "neon pop", "post-punk", 
        "dance-punk", "post-punk revival", "proto-punk", "psychobilly", 
        "punkabilly", "punk blues", "punk jazz", "punk pathetique", 
        "punk rap", "reggae punk", "riot grrrl", "ska punk", 
        "skate punk", "street punk", "surf punk", "trallpunk", "anarcho-punk", "oi-punk", "punk cabaret","emo","Ska punk &#x200e;"
      ]],
      ["regional", [
        "regional","african", "african heavy metal", "african hip hop", "african popular music", 
        "afro pop", "afrobeat", "afrobeats", "afro house", "amapiano", "apala", 
        "arabesque", "afro tech", "benga", "bikutsi", "bongo flava", 
        "boomba", "bubu music", "cape jazz", "chaabi", "chalga", 
        "chaoui music", "chimurenga", "congolese rumba", "coupé-décalé", 
        "fuji music", "gende", "gnawa", "gqom", "gumbe", 
        "highlife", "hiplife", "igbo highlife", "igbo rap", "ikorodo", 
        "ikwokirikwo", "isicathamiya", "jit", "jùjú", "kadongo kamu", 
        "kizomba", "kuduro", "kwaito", "kwela", "lingala", 
        "makossa", "maloya", "ma'luf", "marabi", "marrabenta", 
        "mbalax", "mbaqanga", "mbube", "morna", "music of egypt", 
        "music of nigeria", "ndombolo", "owerri bongo", "ojapiano", 
        "palm-wine", "raï", "rumba", "sakara", "sega", 
        "seggae", "semba", "shangaan electro", "soukaous", 
        "kwassa kwassa", "taarab", "zamrock", "zouglou", 
        "antarctica", "nunatak (band)", "central asian", 
        "shashmaqam", "pashto music", "kazakh folk music", 
        "kyrgyz folk music", "mongolian folk music", "tuvan throat singing", 
        "tajik folk music", "east asian", "c-pop", 
        "cantopop", "hokkien pop", "mandopop", "chinese hip hop", 
        "chinese folk music", "chinese rock", "hong kong english pop", 
        "hong kong hip hop", "taiwanese hip hop", "taiwanese pop", 
        "taiwanese rock", "anime song", "enka", "j-pop", 
        "japanese hip hop", "japanese jazz", "japanese rock", 
        "kayōkyoku", "k-pop", "korean folk music", "korean hip hop", 
        "korean rock", "trot", "south asian", "asian underground", 
        "baul", "bhangra", "bhawaiya", "dappankuthu", 
        "dohori", "filmi", "indian classical", "carnatic", 
        "hindustani classical", "indian jazz", "indian pop", 
        "indian rock", "raga rock", "lavani", "morlam", 
        "ragini", "sufi rock", "sri lankan", "baila", 
        "sri lankan hip hop", "southeast asian", "malaysian hip hop", 
        "malaysian pop", "malaysian rock", "gamelan", "dangdut", 
        "indo pop", "sundanese pop", "keroncong", "luk thung", 
        "luk krung", "thai pop", "thai string pop", "manila sound", 
        "original pilipino", "pinoy pop", "pinoy rock", "l-pop", 
        "mor lam", "v-pop", "middle eastern", "arabic music", 
        "arabic pop music", "fann at-tanbura", "fijiri", 
        "khaliji", "liwa", "music of israel", "persian traditional music", 
        "sawt", "music of turkey", "turkish folk music", "gypsy music", 
        "australasia & oceania", "australian folk music", 
        "australian hip hop", "indigenous music of australia", 
        "music of hawaii", "music of new zealand", "māori music", 
        "kapa haka", "music of polynesia", "music of samoa", 
        "european", "balkan states", "balkan music", 
        "balkan brass", "balkan folk music", "music of albania", 
        "music of bosnia and herzegovina", "sevdalinka", "music of bulgaria", 
        "music of cyprus", "music of greece", "music of kosovo", 
        "music of montenegro", "music of north macedonia", 
        "music of romania", "romani music", "gypsy music", 
        "baltic states", "lithuanian folk music", "music of estonia", 
        "music of latvia", "caucasus", "music of armenia", 
        "music of azerbaijan", "music of georgia (country)", 
        "central european states", "music of austria", 
        "viennese waltz", "yodeling", "music of croatia", 
        "music of the czech republic", "polka", "music of germany", 
        "music of hungary", "music of liechtenstein", "music of poland", 
        "polka", "music of serbia", "music of slovakia", 
        "music of slovenia", "music of switzerland", "yodeling", 
        "nordic/scandinavian states", "nordic folk music", 
        "music of denmark", "danish traditional music", "music of finland", 
        "rautalanka (finnish surf-rock)", "music of iceland", 
        "music of norway", "music of sweden", "music of the faroe islands", 
        "viking metal", "slavic states", "klezmer", 
        "music of belarus", "music of moldova", "music of russia", 
        "music of buryatia", "russian folk music", "music of ukraine", 
        "music of yugoslavia", "western european", 
        "music of andorra", "music of belgium", "music of france", 
        "music of ireland", "celtic music", "music of italy", 
        "music of luxembourg", "music of malta", "music of monaco", 
        "music of the netherlands", "music of portugal", 
        "music of spain", "music of the united kingdom", "britpop", 
        "music of scotland", "music of wales","Norte ño &#x200e;","Norte ño","Forró &#x200e;","Humppa &#x200e;"
      ]],
      ["latin & south american", [
        "latin","brazilian", "axé", "brazilian rock", "brega", "tecnobrega", 
        "choro", "forró", "frevo", "funk carioca", "lambada", 
        "zouk-lambada", "maracatu", "música popular brasileira", 
        "tropicalia", "música sertaneja", "samba", "pagode", 
        "samba rock", "caribbean", "baithak gana", "bouyon", 
        "cadence-lypso", "calypso", "cha-cha-chá", "chutney", 
        "chutney soca", "chutney parang", "compas", "dancehall", 
        "mambo", "mento", "merengue", "méringue", "mozambique", 
        "pichakaree", "punta", "punta rock", "rasin", 
        "reggae", "dub", "lovers rock", "ragga", "reggae fusion", 
        "ragga jungle", "reggae rock", "reggaeton", 
        "alternative reggaeton", "moombahton", "roots reggae", 
        "rocksteady", "rumba", "salsa", "ska", 
        "ska punk", "two-tone", "soca", "power soca", 
        "son cubano", "songo", "timba", "twoubadou", 
        "zouk", "hispanic", "boogaloo", "bullerengue", 
        "flamenco", "cantes de ida y vuelta", "fandangos", 
        "soleá", "alegrías", "bulerías", "peteneras", 
        "tango", "toná", "martinetes", "tonás", 
        "grupera", "hispanic rhythmic", "latin christian", 
        "latin pop", "latin ballad", "latin rock", 
        "latin alternative", "rock en español", "latin jazz", 
        "afro-cuban jazz", "bossa nova", "mariachi", 
        "ranchera", "reggaeton", "latin trap", "regional mexican", 
        "banda", "norteño", "tango", "tropical", 
        "bachata", "bolero", "criolla", "cumbia", 
        "chicha", "porro", "guajira", "mambo", 
        "merengue", "música popular (colombia)", "rumba", 
        "salsa", "salsa romántica", "son", "tejano", 
        "timba", "tropipop", "urbano music", "vallenato", 
        "north american", "american rock", "canadian folk music", 
        "indigenous music of north america", "inuit music", 
        "music of alaska", "indigenous music of canada", 
        "music of greenland", "ragtime", "cakewalk", 
        "classic rag", "folk ragtime", "honky-tonk piano", 
        "novelty piano", "stomp", "stride piano", "swing music", "latin", "duranguense", "baião", "candombe", "cuarteto", "trova"
      ]],
      ["religious", [
        "religious","sikh music", "buddhist music", "christian music", 
        "contemporary christian music", "contemporary worship music", 
        "christian rock", "christian alternative rock", 
        "easy listening", "country gospel", "church music", 
        "gospel", "worship", "hymns", 
        "jesus music", "liturgical music", "spirituals", 
        "gregorian chant", "islamic music", "modern pagan music", 
        "music of ancient greece", "new-age music", "shamanic music", "contemporary christian", "christian", "nasheed","Contemporary christian &#x200e;"
      ]],
      ["traditional_folk", [
        "american patriotic music", "christmas music", 
        "fado", "huayno", "mele", 
        "pastorale", "polka", "ragtime", 
        "son mexicano", "música criolla"
      ]],
      ["comedian", [
        "comedy","Comedy rock", "parody"

      ]],
      ["world music", [
        "world music","native american","african","gypsy"
    ]],
        ["soundtrack", [
        "soundtrack","soundtrack/movie","soundtrack/anime","soundtrack/television","soundtrack/musical"
    ]],
    ["miscellaneous", [
        "novelty","humor","spoken word","musical","vaudeville","pirate band",
        "ballroom dance music", "vogue (dance)", "bedroom production",
        "children's music", "computer music", "hyperpop",
        "internet meme", "dance music", "slow dance",
        "drug use in music", "incidental music", "independent music",
        "multi-instrumentalist", "a cappella", "bassist",
        "drummer", "percussion", "found object (music)",
        "guitarist", "pianist", "keyboardist",
        "one-man band", "lgbt music", "patriotic music",
        "martial industrial", "regional music", "theatre music",
        "virtuoso", "yodeling","Children's music &#x200e;","43:40"
      ]]
]);

async function loadProcessedData() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error('Erreur de chargement');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('loading').textContent =
            'Erreur lors du chargement des données';
        throw error;
    }
}

function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function initializeFilters(data) {
    // Get genre from URL only on initial load
    const urlGenre = initialLoad ? getUrlParameter('genre')?.toLowerCase() : null;
    
    // Initialize main categories dropdown
    const mainCategoryItems = document.querySelector('#mainCategoryFilter .dropdown-items');
    const mainCategories = getMainCategories();
    
    mainCategories.forEach(category => {
        // Check if this category should be selected on initial load
        const shouldBeChecked = !urlGenre || 
            (urlGenre.toLowerCase() === category.toLowerCase());
        createCheckboxItem(mainCategoryItems, `main-${category}`, category, shouldBeChecked);
    });

    // Get selected main categories based on URL or default
    let selectedMains = mainCategories;
    if (urlGenre) {
        const matchingCategory = mainCategories.find(cat => cat.toLowerCase() === urlGenre);
        selectedMains = matchingCategory ? [matchingCategory] : mainCategories;
    }

    // Update sub-categories based on selected main categories
    updateSubCategoriesDropdown(getAllSubCategories(selectedMains), data);

    // Add event listeners
    setupEventListeners();

    // Initial updates
    updateTriggerCount('main');
    updateTriggerCount('sub');
    updateFilteredData();

    // Set initialLoad to false after first load
    initialLoad = false;
}

function getMainCategories() {
    return Array.from(genresMap.keys());
}

function createCheckboxItem(container, id, value, checked = false) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'dropdown-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.className = 'category-checkbox';
    checkbox.value = value;
    checkbox.checked = checked;

    const label = document.createElement('label');
    label.htmlFor = id;

    const checkboxCustom = document.createElement('span');
    checkboxCustom.className = 'checkbox-custom';

    const text = document.createElement('span');
    text.textContent = value;

    label.appendChild(checkboxCustom);
    label.appendChild(text);

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);
    container.appendChild(itemDiv);
}

function updateSubCategoriesDropdown(allowedSubCategories, data) {
    const subCategoryItems = document.querySelector('#genreFilter .dropdown-items');
    subCategoryItems.innerHTML = ''; // Clear existing items
    
    const genres = new Set(allowedSubCategories);
    genres.forEach(genre => {
        const genreKey = Object.keys(data).find(key => key.toLowerCase() === genre.toLowerCase());
        if (genreKey) {
            console.log("genr Key : "+genreKey)
            console.log("genr 3ad : "+genre)
            createCheckboxItem(subCategoryItems, `genre-${genre}`, genre, true);
        }
    });
    updateFilteredData();
}

function toggleAllSubCategories() {
    const subCheckboxes = document.querySelectorAll('#genreFilter .category-checkbox');
    const allChecked = Array.from(subCheckboxes).every(cb => cb.checked);
    subCheckboxes.forEach(cb => cb.checked = !allChecked);
}

function setupEventListeners() {
    // Setup dropdowns toggling
    setupDropdownToggle('mainCategoryDropdownTrigger', 'mainCategoryFilter');
    setupDropdownToggle('genreDropdownTrigger', 'genreFilter');

    // Main categories change handler
    document.querySelector('#mainCategoryFilter .dropdown-items').addEventListener('change', event => {
        if (event.target.type === 'checkbox') {
            // Get updated selected main categories
            const selectedMains = getSelectedMainCategories();
            // Update sub-categories dropdowns
            const allowedSubs = getAllSubCategories(selectedMains);
            updateSubCategoriesDropdown(allowedSubs, fullData);
            // Update counts and visualization
            updateTriggerCount('main');
            updateTriggerCount('sub');
            updateFilteredData();
        }
    });
    // Sub-categories change handler
    document.querySelector('#genreFilter .dropdown-items').addEventListener('change', event => {
        if (event.target.type === 'checkbox') {
            updateFilteredData();
            updateTriggerCount('sub');
        }
    });

    // Select all buttons
    document.getElementById('selectAllMainCategories').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAllMainCategories();
        updateTriggerCount('main');
        updateFilteredData();
    });

    document.getElementById('selectAll').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAllSubCategories();
        updateTriggerCount('sub');
        updateFilteredData();
    });

    // Artist filter
    document.getElementById('artistFilter').addEventListener('input', updateFilteredData);

    // Reset button
    document.getElementById('resetFilters').addEventListener('click', resetAllFilters);
}

function toggleAllMainCategories() {
    const mainCheckboxes = document.querySelectorAll('#mainCategoryFilter .category-checkbox');
    const allChecked = Array.from(mainCheckboxes).every(cb => cb.checked);
    // Toggle checkboxes
    mainCheckboxes.forEach(cb => cb.checked = !allChecked);
    // Get the new selected categories
    const selectedMains = getSelectedMainCategories();
    // Update sub-categories
    const allowedSubs = getAllSubCategories(selectedMains);
    updateSubCategoriesDropdown(allowedSubs, fullData);
    // Important: Update the visualization
    updateFilteredData();
}

function getSelectedMainCategories() {
    return Array.from(document.querySelectorAll('#mainCategoryFilter .category-checkbox'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

// Helper function to get all sub-categories for given main categories
function getAllSubCategories(selectedMainCategories) {
    let allSubs = new Set();
    selectedMainCategories.forEach(main => {
        const subCategories = genresMap.get(main) || [];
        subCategories.forEach(sub => allSubs.add(sub));
    });
    return Array.from(allSubs);
}

function resetAllFilters() {
    // 1. Reset main categories (all selected by default)
    const mainCategoryCheckboxes = document.querySelectorAll('#mainCategoryFilter .category-checkbox');
    mainCategoryCheckboxes.forEach(cb => {
        cb.checked = true;
    });
    updateTriggerCount('main');
    // 2. Reset sub-categories based on main categories
    const mainCategories = getMainCategories();
    const allSubCategories = getAllSubCategories(mainCategories);
    updateSubCategoriesDropdown(allSubCategories, fullData);
    updateTriggerCount('sub');
    // 3. Reset artist search
    document.getElementById('artistFilter').value = '';
    // 4. Reset dropdown UI states
    const dropdowns = ['mainCategoryDropdownTrigger', 'genreDropdownTrigger'];
    const menus = ['mainCategoryFilter', 'genreFilter'];
    dropdowns.forEach((triggerId, index) => {
        const trigger = document.getElementById(triggerId);
        const menu = document.getElementById(menus[index]);
        trigger.classList.remove('active');
        menu.classList.remove('show');
    });
    // 5. Update data and visualization
    updateFilteredData();
}

function updateTriggerCount(type) {
    const selector = type === 'main' ? '#mainCategoryFilter' : '#genreFilter';
    const count = document.querySelectorAll(`${selector} .category-checkbox:checked`).length;
    const countSpan = document.querySelector(type === 'main' ? 
        '#mainCategoryDropdownTrigger .selected-count' : 
        '#genreDropdownTrigger .selected-count');
    countSpan.textContent = count;
}

// Helper function to setup dropdown toggle behavior
function setupDropdownToggle(triggerId, menuId) {
    const trigger = document.getElementById(triggerId);
    const menu = document.getElementById(menuId);

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        trigger.classList.toggle('active');
        menu.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !trigger.contains(e.target)) {
            trigger.classList.remove('active');
            menu.classList.remove('show');
        }
    });
}

function updateFilteredData() {
    // Get selected main categories
    const mainCategories = getMainCategories();
    const selectedMainCategories = initialLoad && getUrlParameter('genre')?.toLowerCase() ? 
        [mainCategories.find(cat => cat.toLowerCase() === getUrlParameter('genre').toLowerCase())] : 
        getSelectedMainCategories();
    // Get allowed sub-categories based on selected main categories
    const allowedSubCategories = getAllSubCategories(selectedMainCategories.filter(Boolean));
    // Get selected sub-categories
    const selectedGenres = Array.from(document.querySelectorAll('#genreFilter .category-checkbox:checked'))
        .map(cb => cb.value.toLowerCase())
        .filter(genre => allowedSubCategories.includes(genre.toLowerCase()));
    // Get artist search value
    const artistSearch = document.getElementById('artistFilter').value.toLowerCase();
    // Filter the data
    filteredData = {};
    Object.entries(fullData).forEach(([genre, data]) => {
        if (selectedGenres.includes(genre.toLowerCase()) &&
            (!artistSearch || data.artist.toLowerCase().includes(artistSearch))) {
            filteredData[genre] = data;
        }
    });
    // Update metrics and visualization
    document.getElementById('genreCount').textContent = Object.keys(filteredData).length;
    updateMetrics(filteredData);
    createBubbleChart(filteredData);
}

// Helper function to update metrics
function updateMetrics(data) {
    const totalSongs = Object.values(data).reduce((sum, d) => sum + d.songCount, 0);
    const totalArtists = Object.keys(data).length;
    document.getElementById('genreCount').textContent = Object.keys(data).length;
    document.getElementById('artistCount').textContent = totalArtists;
    document.getElementById('songCount').textContent = totalSongs.toLocaleString();
}

function createBubbleChart(data) {
    // Dimensions et marges
    const width = 1000;
    const height = 500;
    const margin = { top: 40, right: 100, bottom: 60, left: 80 };
    // Nettoyer le contenu précédent
    d3.select("#chart").selectAll("*").remove();
    // Créer le SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    // Créer les échelles
    const xScale = d3.scaleBand()
        .domain(Object.keys(data))
        .range([0, width])
        .padding(0.4);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data), d => d.songCount) * 1.1])
        .range([height, 0]);
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(Object.values(data), d => d.albumCount)])
        .range([10, 50]);
    // Palette de couleurs personnalisée
    const colorScale = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range([
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
            '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71',
            '#F1C40F'
        ]);
    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    // Ajouter l'axe X
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");
    // Ajouter l'axe Y
    svg.append("g")
        .call(yAxis);
    // Labels des axes
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Nombre de Chansons");
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + 50})`)
        .attr("text-anchor", "middle")
        .text("Genres Musicaux");
    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // Ajouter les bulles
    svg.selectAll("circle")
        .data(Object.entries(data))
        .join("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d[0]) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d[1].songCount))
        .attr("r", d => radiusScale(d[1].albumCount))
        .attr("fill", d => colorScale(d[0]))
        .attr("opacity", 0.7)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.9);

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            tooltip.html(`
                <strong>${d[1].artist}</strong><br/>
                Genre: ${d[0]}<br/>
                Nombre de chansons: ${d[1].songCount}<br/>
                Nombre d'albums: ${d[1].albumCount}<br/>
                ${d[1].details.deezerFans ?
                    `Fans Deezer: ${d[1].details.deezerFans.toLocaleString()}` : ''}
            `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.7);

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

}

async function init() {
    try {
        fullData = await loadProcessedData();
        document.getElementById('loading').style.display = 'none';
        initializeFilters(fullData);
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
    }
}

init();