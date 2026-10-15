const image = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;

const commonsThumb = (path) => `https://upload.wikimedia.org/wikipedia/commons/${path}`;

const petCareGuides = {
  dogs: {
    title: 'Dogs',
    emoji: '🐕',
    image: image('photo-1543466835-00a7907e9de1'),
    imageCredits: [
      { label: 'German Shepherd — Jakub Hałun', source: 'https://commons.wikimedia.org/wiki/File:20110425_German_Shepherd_Dog_8505.jpg', license: 'https://creativecommons.org/licenses/by-sa/4.0/', licenseName: 'CC BY-SA 4.0' },
      { label: 'Toy Poodle — Basile Morin', source: 'https://commons.wikimedia.org/wiki/File:Toy_Poodle_wearing_clothes_in_Tokyo.jpg', license: 'https://creativecommons.org/licenses/by-sa/4.0/', licenseName: 'CC BY-SA 4.0' },
    ],
    animals: [
      { name: 'Golden Retriever', image: image('photo-1543466835-00a7907e9de1'), tags: ['golden retriever', 'puppy'], food: 'Choose a complete food for the dog’s life stage; puppies need puppy food, while adults need an adult formula.' },
      { name: 'German Shepherd', image: commonsThumb('thumb/6/61/20110425_German_Shepherd_Dog_8505.jpg/960px-20110425_German_Shepherd_Dog_8505.jpg'), tags: ['german shepherd', 'puppy'], food: 'Choose a complete puppy formula while growing and an adult large-breed or breed-specific formula later.' },
      { name: 'Labrador Retriever', image: image('photo-1576201836106-db1758fd1c97'), tags: ['labrador', 'puppy'], food: 'Use a complete food for the correct life stage and portion it for a healthy body condition.' },
      { name: 'Beagle', image: image('photo-1541599540903-216a46ca1dc0'), tags: ['beagle'], food: 'Use complete dog food matched to age and activity; measure portions and treats.' },
      { name: 'Poodle', image: commonsThumb('thumb/6/6f/Toy_Poodle_wearing_clothes_in_Tokyo.jpg/960px-Toy_Poodle_wearing_clothes_in_Tokyo.jpg'), tags: ['poodle'], food: 'Choose complete dog food for the dog’s size and life stage.' },
      { name: 'Indian Pariah Dog', image: image('photo-1543466835-00a7907e9de1'), tags: ['indian pariah', 'indie dog'], food: 'Choose a complete dog food for age, size, and health; breed alone does not determine the diet.' },
      { name: 'All puppies', image: image('photo-1576201836106-db1758fd1c97'), tags: ['puppy'], food: 'Puppies need a complete puppy food suitable for their expected adult size; follow the package feeding guide.' },
    ],
    care: {
      'food-nutrition': 'Complete dog food for the correct life stage and size. Do not use cat food as a dog’s regular diet.',
      'treats-snacks': 'Use dog-labeled treats in small portions; keep all treats within your veterinarian’s calorie advice.',
      'toys-play': 'Choose durable toys sized so they cannot be swallowed; inspect for damage and supervise chewing.',
      'beds-furniture': 'Choose a washable bed long and wide enough for the dog to stretch out; consider supportive foam for older dogs.',
      'collars-leashes': 'Use a correctly fitted collar with ID or a suitable harness; check the fit regularly and attach the leash to a secure point.',
      'grooming-hygiene': 'Use dog-labeled shampoo only when needed; human shampoo can irritate a dog’s skin.',
      'health-care': 'For illness, injury, vaccines, or parasite treatment, contact a veterinarian; do not dose human medicines.',
      'health-supplements': 'Use supplements only when a veterinarian recommends them for this dog.',
    },
  },
  cats: {
    title: 'Cats',
    emoji: '🐈',
    image: image('photo-1514888286974-6c03e2ca1dba'),
    animals: [
      { name: 'Persian', image: image('photo-1514888286974-6c03e2ca1dba'), tags: ['persian'], food: 'Feed complete cat food for the cat’s age and health; keep fresh water available.' },
      { name: 'Siamese', image: image('photo-1574158622682-e40e69881006'), tags: ['siamese'], food: 'Choose complete cat food by life stage; ask your vet about any special dietary needs.' },
      { name: 'Maine Coon', image: image('photo-1514888286974-6c03e2ca1dba'), tags: ['maine coon'], food: 'Choose complete cat food matched to life stage; follow feeding guidance rather than breed marketing alone.' },
      { name: 'British Shorthair', image: image('photo-1574158622682-e40e69881006'), tags: ['british shorthair'], food: 'Feed a complete cat diet and monitor portions and body condition.' },
      { name: 'Domestic Shorthair', image: image('photo-1514888286974-6c03e2ca1dba'), tags: ['domestic shorthair'], food: 'Choose complete wet or dry cat food for the correct life stage.' },
      { name: 'Indian Domestic Cat', image: image('photo-1574158622682-e40e69881006'), tags: ['indian domestic', 'indie cat'], food: 'Choose a complete cat food based on age and health; provide clean water.' },
      { name: 'All kittens', image: image('photo-1514888286974-6c03e2ca1dba'), tags: ['kitten'], food: 'Kittens need complete food labeled for growth; adult food may not meet their needs.' },
    ],
    care: {
      'food-nutrition': 'Feed complete food made for cats and their life stage. Cats have different nutritional needs from dogs.',
      'treats-snacks': 'Choose cat-labeled treats and offer sparingly; never give dog treats as a regular substitute.',
      'toys-play': 'Use cat-safe toys and supervise string, ribbon, and wand toys; put them away after play.',
      'beds-furniture': 'Offer a quiet, stable bed or perch where the cat can rest undisturbed; washable covers are useful.',
      'collars-leashes': 'If using a collar, choose a quick-release/breakaway cat collar and check the fit often.',
      'grooming-hygiene': 'Brush regularly as appropriate for coat length. Use cat-labeled shampoo only if bathing is needed.',
      'health-care': 'Use a veterinarian for diagnosis and cat-specific medicines; never give human painkillers to cats.',
      'health-supplements': 'Ask a veterinarian before adding supplements; some ingredients safe for people or dogs can harm cats.',
    },
  },
  birds: {
    title: 'Birds',
    emoji: '🦜',
    image: image('photo-1552728089-57bdde30beb3'),
    imageCredits: [
      { label: 'Domestic canary — Mounir Neddi', source: 'https://commons.wikimedia.org/wiki/File:Domestic_canary_from_Morocco.jpg', license: 'https://creativecommons.org/licenses/by-sa/4.0/', licenseName: 'CC BY-SA 4.0' },
    ],
    animals: [
      { name: 'Budgerigar (Budgie)', image: image('photo-1552728089-57bdde30beb3'), tags: ['budgie', 'budgerigar', 'parakeet'], food: 'Offer a balanced budgie-formulated diet; seed-only diets can be nutritionally incomplete.' },
      { name: 'Cockatiel', image: image('photo-1535083783855-76ae62b2914e'), tags: ['cockatiel'], food: 'Use a cockatiel-appropriate balanced diet; ask an avian veterinarian about safe fresh foods.' },
      { name: 'Lovebird', image: image('photo-1552728089-57bdde30beb3'), tags: ['lovebird'], food: 'Choose a balanced diet labeled for small parrots/lovebirds; avoid relying on seed alone.' },
      { name: 'African Grey Parrot', image: image('photo-1535083783855-76ae62b2914e'), tags: ['african grey', 'parrot'], food: 'Use a balanced parrot diet with veterinary guidance; avoid unbalanced seed-heavy feeding.' },
      { name: 'Amazon Parrot', image: image('photo-1552728089-57bdde30beb3'), tags: ['amazon parrot', 'parrot'], food: 'Feed a balanced parrot-formulated diet and confirm fresh-food choices with an avian vet.' },
      { name: 'Canary', image: commonsThumb('thumb/7/71/Domestic_canary_from_Morocco.jpg/960px-Domestic_canary_from_Morocco.jpg'), tags: ['canary'], food: 'Use canary-specific balanced food; clean water and appropriate portions matter.' },
      { name: 'Finch', image: image('photo-1535083783855-76ae62b2914e'), tags: ['finch'], food: 'Choose food formulated for the finch species; small birds have specific seed/pellet needs.' },
    ],
    care: {
      'food-nutrition': 'Use food formulated for the bird species. Seed mixes alone may not provide a balanced diet; consult an avian veterinarian.',
      'treats-snacks': 'Offer only bird-safe foods in small amounts; avoid avocado, chocolate, caffeine, and salty foods.',
      'toys-play': 'Use bird-safe toys sized for the species; inspect for loose fibers, sharp edges, and parts that can be swallowed.',
      'beds-furniture': 'Birds need safe perches and an appropriately sized cage, not a mammal-style bed. Avoid nesting materials unless advised for the bird.',
      'collars-leashes': 'Collars are not appropriate for pet birds. Use only a bird harness after careful training and expert guidance.',
      'grooming-hygiene': 'Provide safe bathing opportunities and clean housing; do not use soap or shampoo on feathers unless an avian vet directs it.',
      'health-care': 'Find an avian veterinarian for bird-specific checkups and illness; birds can hide signs of disease.',
      'health-supplements': 'Do not add vitamins to food or water without avian-veterinary advice; excess supplements can be harmful.',
    },
  },
  fish: {
    title: 'Fish & Aquatic',
    emoji: '🐠',
    image: image('photo-1522069169874-c58ec4b76be5'),
    animals: [
      { name: 'Betta', image: image('photo-1524704654690-b56c05c78a00'), tags: ['betta'], food: 'Use betta-specific food in small portions; remove uneaten food and avoid overfeeding.' },
      { name: 'Goldfish', image: image('photo-1522069169874-c58ec4b76be5'), tags: ['goldfish'], food: 'Choose a goldfish-formulated food and feed small portions suited to the fish and water conditions.' },
      { name: 'Guppy', image: image('photo-1535591273668-578e31182c4f'), tags: ['guppy'], food: 'Use a suitable tropical-fish micro pellet or flake; vary foods only when appropriate for the species.' },
      { name: 'Tetra', image: image('photo-1524704654690-b56c05c78a00'), tags: ['tetra'], food: 'Use small tropical-fish flakes or micro pellets sized for the fish.' },
      { name: 'Angelfish', image: image('photo-1522069169874-c58ec4b76be5'), tags: ['angelfish'], food: 'Choose a suitable tropical fish diet and portion it to avoid uneaten food in the aquarium.' },
      { name: 'Plecostomus (Pleco)', image: image('photo-1535591273668-578e31182c4f'), tags: ['pleco', 'plecostomus'], food: 'Choose a species-appropriate sinking food; algae wafers are not suitable as a complete diet for every pleco.' },
    ],
    care: {
      'food-nutrition': 'Select food for the fish species and feeding behavior; feed sparingly and remove leftovers to protect water quality.',
      'treats-snacks': 'Use aquatic treats sparingly and only when suitable for the species and tank.',
      'toys-play': 'Fish need a stable, species-appropriate aquarium with safe enrichment, filtration, and water conditions—not toys.',
      'beds-furniture': 'Beds do not apply to fish. Choose aquarium substrate, hides, and plants that are safe for the species.',
      'collars-leashes': 'Collars and leashes do not apply to fish.',
      'grooming-hygiene': 'Do not use shampoo or soap. Maintain the aquarium and water quality with equipment suitable for the tank.',
      'health-care': 'For illness, consult an aquatic veterinarian or qualified aquatic animal specialist; test water before assuming disease.',
      'health-supplements': 'Use water conditioners or treatments only as labeled for the tank and its species; do not add human medicine.',
    },
  },
  hamsters: {
    title: 'Hamsters & Guinea Pigs',
    emoji: '🐹',
    image: image('photo-1425082661705-1834bfd09dca'),
    animals: [
      { name: 'Syrian Hamster', tags: ['syrian hamster', 'hamster'], food: 'Use a complete hamster diet; avoid sugary treats and provide fresh water.' },
      { name: 'Dwarf Hamster', tags: ['dwarf hamster', 'hamster'], food: 'Use a complete hamster diet and carefully limit sugary treats.' },
      { name: 'Guinea Pig', tags: ['guinea pig'], food: 'Guinea pigs need constant grass hay, a guinea-pig-specific source of vitamin C, and fresh water.' },
      { name: 'Gerbil', tags: ['gerbil'], food: 'Use a complete gerbil-formulated diet and measured portions.' },
      { name: 'Rat', tags: ['rat'], food: 'Use a complete rat-formulated diet; avoid relying on seed mixes or treats.' },
      { name: 'Mouse', tags: ['mouse'], food: 'Use a complete mouse-formulated diet with treats only in small amounts.' },
    ],
    care: {
      'food-nutrition': 'Use food made for the exact small-pet species. Hamsters, rats, and guinea pigs do not share one interchangeable diet.',
      'treats-snacks': 'Choose species-safe treats and offer sparingly; avoid sticky, sugary snacks and foods unsafe for that species.',
      'toys-play': 'Use chew toys and enrichment sized for the animal; check for safe materials and supervise new items.',
      'beds-furniture': 'Provide species-appropriate bedding and hiding places. Avoid aromatic cedar and dusty bedding; never use loose fluffy nesting fibers.',
      'collars-leashes': 'Collars are unsafe for small mammals. Avoid harnesses unless an exotics veterinarian recommends and fits one.',
      'grooming-hygiene': 'Most small mammals groom themselves; use a soft brush where suitable. Do not bathe or use shampoo unless an exotics vet directs it.',
      'health-care': 'Choose a veterinarian experienced with the species (often an exotics vet); small mammals can deteriorate quickly.',
      'health-supplements': 'Give supplements only as advised by a vet. Guinea pigs need dietary vitamin C, but product and dose matter.',
    },
  },
  horses: {
    title: 'Horses & Farm Pets',
    emoji: '🐴',
    image: image('photo-1553284965-83fd3e82fa5a'),
    animals: [
      { name: 'Horse', tags: ['horse'], food: 'Base feeding on forage, body condition, workload, and veterinary advice; feed changes should be gradual.' },
      { name: 'Pony', tags: ['pony'], food: 'Use a forage-led diet and portions appropriate to the pony’s body condition and workload.' },
      { name: 'Donkey', tags: ['donkey'], food: 'Donkeys have distinct nutritional needs; seek equine-veterinary or qualified nutrition advice.' },
    ],
    care: {
      'food-nutrition': 'Base the diet on appropriate forage and expert advice; do not assume high-energy horse feed suits every equid.',
      'treats-snacks': 'Use equine-safe treats sparingly; check with the caretaker or veterinarian about health restrictions.',
      'toys-play': 'Use durable, purpose-made stable enrichment and supervise unfamiliar items.',
      'beds-furniture': 'Choose clean, absorbent stall bedding appropriate to the animal and stable management.',
      'collars-leashes': 'Use correctly fitted, purpose-made halters and tack; do not leave unsafe equipment on unattended animals.',
      'grooming-hygiene': 'Use equine grooming tools and products; keep tools clean and do not share between animals without cleaning.',
      'health-care': 'Consult an equine veterinarian for illness, medicines, vaccinations, and parasite control.',
      'health-supplements': 'Use feed supplements only with an equine veterinarian or qualified nutritionist’s guidance.',
    },
  },
  rabbits: {
    title: 'Rabbits & Bunnies',
    emoji: '🐰',
    image: image('photo-1585110396000-c9ffd4e4b308'),
    animals: [
      { name: 'Holland Lop', tags: ['holland lop', 'rabbit'], food: 'Provide unlimited grass hay, fresh water, and measured rabbit pellets; introduce greens carefully.' },
      { name: 'Netherland Dwarf', tags: ['netherland dwarf', 'rabbit'], food: 'Offer unlimited grass hay and measured rabbit pellets, with fresh water always available.' },
      { name: 'Lionhead', tags: ['lionhead', 'rabbit'], food: 'Use a hay-based rabbit diet and brush the coat regularly to reduce swallowed fur.' },
      { name: 'Rex Rabbit', tags: ['rex rabbit', 'rabbit'], food: 'Provide unlimited grass hay, clean water, and measured rabbit-formulated pellets.' },
      { name: 'Mixed-breed Rabbit', tags: ['rabbit', 'bunny'], food: 'Most adult rabbits need unlimited grass hay, fresh water, and measured rabbit pellets.' },
    ],
    care: {
      'food-nutrition': 'Grass hay should make up the main part of most adult rabbits’ diet; use rabbit pellets and greens appropriately.',
      'treats-snacks': 'Offer small amounts of rabbit-safe leafy greens or approved treats; avoid sugary mixes and sudden diet changes.',
      'toys-play': 'Provide safe chew and forage toys; avoid items with small parts, toxic paint, or unsafe fibers.',
      'beds-furniture': 'Provide a dry, absorbent resting area and a secure hide. Bedding should be dust-free and safe if chewed.',
      'collars-leashes': 'Do not use a collar. Harnesses can injure rabbits if they panic; ask a rabbit-savvy veterinarian before use.',
      'grooming-hygiene': 'Brush as needed for coat type, especially during shedding. Rabbits generally should not be bathed or shampooed.',
      'health-care': 'Use a rabbit-savvy veterinarian for dental, digestive, and other health concerns; rabbits should not be given human medicines.',
      'health-supplements': 'Do not add supplements unless a rabbit-savvy veterinarian recommends them.',
    },
  },
  reptiles: {
    title: 'Reptiles & Amphibians',
    emoji: '🦎',
    image: image('photo-1437622368342-7a3d73a34c8f'),
    imageCredits: [
      { label: 'Tortoise — Moise Nicu', source: 'https://commons.wikimedia.org/wiki/File:Tortoise_portrait.JPG', license: 'https://creativecommons.org/licenses/by/3.0/', licenseName: 'CC BY 3.0' },
      { label: 'Eastern bearded dragon — jjron', source: 'https://commons.wikimedia.org/wiki/File:Eastern-Bearded-Dragon-2.2,-Vic,-3.1.2008.jpg', license: 'https://creativecommons.org/licenses/by-sa/3.0/', licenseName: 'CC BY-SA 3.0' },
      { label: 'Axolotl — Stan Shebs', source: 'https://commons.wikimedia.org/wiki/File:Ambystoma_mexicanum_1.jpg', license: 'https://creativecommons.org/licenses/by-sa/3.0/', licenseName: 'CC BY-SA 3.0' },
    ],
    animals: [
      { name: 'Aquatic Turtle', image: image('photo-1437622368342-7a3d73a34c8f'), tags: ['aquatic turtle', 'turtle'], food: 'Use aquatic-turtle food appropriate to species and age; one pellet type may not suit every turtle.' },
      { name: 'Tortoise', image: commonsThumb('thumb/5/52/Tortoise_portrait.JPG/960px-Tortoise_portrait.JPG'), tags: ['tortoise'], food: 'Diet varies greatly by tortoise species; confirm safe greens and hay with a reptile veterinarian.' },
      { name: 'Bearded Dragon', image: commonsThumb('thumb/1/1b/Eastern-Bearded-Dragon-2.2%2C-Vic%2C-3.1.2008.jpg/960px-Eastern-Bearded-Dragon-2.2%2C-Vic%2C-3.1.2008.jpg'), tags: ['bearded dragon'], food: 'Diet changes with age and should combine suitable greens and feeder insects; confirm details with a reptile vet.' },
      { name: 'Leopard Gecko', image: commonsThumb('7/7f/Eublepharis_macularius_2009_G6.jpg'), tags: ['leopard gecko'], food: 'Use appropriate live feeder insects and supplementation under reptile-veterinary guidance.' },
      { name: 'Crested Gecko', image: commonsThumb('a/a9/Gekkoninae_Rhacodactylus_ciliatus_tete.png'), tags: ['crested gecko'], food: 'Use a complete crested-gecko diet and follow the product instructions and species-specific advice.' },
      { name: 'Axolotl', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Ambystoma_mexicanum_1.jpg/960px-Ambystoma_mexicanum_1.jpg', tags: ['axolotl'], food: 'Axolotls need an aquatic, species-specific diet; consult an aquatic or amphibian veterinarian for feeding guidance.' },
    ],
    care: {
      'food-nutrition': 'Food must match the reptile species, life stage, and diet type; turtles, tortoises, and geckos are not interchangeable.',
      'treats-snacks': 'Use only appropriate feeder insects or treats for the exact species; ask a reptile veterinarian about supplementation.',
      'toys-play': 'Reptiles need secure, species-appropriate habitats and enrichment, not conventional pet toys.',
      'beds-furniture': 'Use suitable hides and substrate; a reptile habitat also needs correct temperature and lighting for that species.',
      'collars-leashes': 'Collars are not appropriate for reptiles. Do not restrain or walk a reptile with improvised gear.',
      'grooming-hygiene': 'Do not apply human shampoo, soap, or oils. Follow species-specific habitat hygiene and veterinary guidance.',
      'health-care': 'Find a veterinarian experienced with reptiles; husbandry and temperature problems can look like illness.',
      'health-supplements': 'Calcium and vitamin dosing must match the species, diet, UVB exposure, and veterinary advice.',
    },
  },
  'small-pets': {
    title: 'Small Pets',
    emoji: '🐾',
    image: image('photo-1425082661705-1834bfd09dca'),
    animals: [
      { name: 'Syrian Hamster', tags: ['syrian hamster', 'hamster'], food: 'Use a complete hamster diet and species-appropriate habitat.' },
      { name: 'Dwarf Hamster', tags: ['dwarf hamster', 'hamster'], food: 'Use a complete dwarf-hamster diet; keep sugary treats limited.' },
      { name: 'Guinea Pig', tags: ['guinea pig'], food: 'Provide constant grass hay and a guinea-pig food containing vitamin C.' },
      { name: 'Gerbil', tags: ['gerbil'], food: 'Choose a complete gerbil-formulated diet and safe burrowing enrichment.' },
      { name: 'Rat', tags: ['rat'], food: 'Choose a complete rat-formulated diet with measured fresh-food treats.' },
      { name: 'Mouse', tags: ['mouse'], food: 'Choose a complete mouse-formulated diet and species-appropriate enrichment.' },
    ],
    care: {
      'food-nutrition': 'Choose by exact species: a hamster, guinea pig, gerbil, mouse, and rat need different diets.',
      'treats-snacks': 'Use species-safe treats sparingly; do not assume foods safe for one small pet suit another.',
      'toys-play': 'Choose chew, forage, or exercise enrichment sized for the species and made from safe materials.',
      'beds-furniture': 'Provide suitable dust-free bedding and a hide; avoid aromatic wood shavings and loose fluffy nesting fibers.',
      'collars-leashes': 'Collars are unsafe for small pets; ask an exotics veterinarian before considering any harness.',
      'grooming-hygiene': 'Avoid bathing or shampoo unless a veterinarian directs it; clean habitats with pet-safe products.',
      'health-care': 'Use a veterinarian experienced with the exact species (often an exotics veterinarian).',
      'health-supplements': 'Use supplements only under veterinary guidance; species and dose matter.',
    },
  },
};

export const getPetImage = (petTypeName) => {
  const name = String(petTypeName || '').toLowerCase();
  const petType = Object.entries(petCareGuides).find(
    ([slug, guide]) => name.includes(slug.replace('-', ' ')) || name.includes(guide.title.toLowerCase())
  );
  return petType?.[1].image || petCareGuides.dogs.image;
};

export default petCareGuides;
