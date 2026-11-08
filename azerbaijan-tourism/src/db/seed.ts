import "dotenv/config";
import { db } from "./index";
import { attractions, regions, savedItineraries, submissions, venues } from "./schema";
import { IMG } from "../lib/images";

type RegionSeed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  history: string;
  culture: string;
  tips: string[];
  image: string;
  lat: number;
  lng: number;
  distanceFromBaku: number;
  featured: boolean;
};

type AttractionSeed = {
  region: string;
  name: string;
  type: string;
  description: string;
  image: string;
  ticket: number;
  rating: number;
  lat: number;
  lng: number;
};

type VenueSeed = {
  region: string;
  name: string;
  category: string;
  description: string;
  address: string;
  priceLevel: number;
  avgPrice: number;
  rating: number;
  reviews: number;
  hours: string;
  phone: string;
  image: string;
  lat: number;
  lng: number;
  featured?: boolean;
  amenities: string[];
};

const REGIONS: RegionSeed[] = [
  {
    slug: "baki",
    name: "Bakı",
    tagline: "Qədim İçərişəhər və müasir Alov Qüllələrinin şəhəri",
    description:
      "Xəzər dənizinin sahilində yerləşən paytaxt Bakı — qədim Şərq memarlığı ilə ultra-müasir avropa üslubunun vəhdətidir. İçərişəhər dar küçələri, Bakı Bulvarı isə uzunluğu ilə dünyada seçilən dənizkənarı promenadlardandır. İqtisadiyyatın qəlbi, gece həyatı və qastronomiya səhnəsi ilə ölkənin əsas turizm qapısıdır.",
    history:
      "Bakı haqqında ilk yazılı məlumatlar eramızın V əsrinə təsadüf edir. XII əsrdə Şirvanşahlar dövlətinin paytaxtı olan şəhər orta əsrlərdə İpək Yolunun mühüm limanı idi. XIX əsrdə neft bumu şəhəri dünyanın iqtisadi mərkəzlərindən birinə çevirdi; bu dövrün zənginliyi bu gün 'neft baronları' üslubundaki möhtəşəm binalarda əks olunur. 2000-ci ildə İçərişəhər və Şirvanşahlar Sarayı UNESCO Ümumdünya İrsi siyahısına daxil edildi.",
    culture:
      "Bakı muğam sənətinin, caz musiqisinin və klassik xalçaçılıq ənənəsinin qovuşduğu məkandır. Mart ayında Novruz, sentyabrda isə beynəlxalq caz festivalı keçirilir. Bakılıların mehriban zarafatcıl duyğusu və çay mədəniyyəti şəhərin ayrılmaz hissəsidir — qonaq hər zaman armudu stəkanda dəmlənmiş çayla qarşılanır.",
    tips: [
      "İçərişəhəri səhər tezdən (08:00–10:00) gəzin — turist axını az, işıq isə fotolar üçün idealdır.",
      "Metro və 'BakıKart' ilə şəhərdə nəqliyyat çox ucuzdur (bir gediş 50 qəpik).",
      "May və sentyabr ayları hava istirahət üçün ən əlverişli dövrdür; avqustda küləkli günlərə hazır olun.",
      "Bazar günləri Yaşıl Bazar yerli dadların — pendir, mürəbbə və qurudulmuş meyvələrin alınması üçün ideal məkandır.",
    ],
    image: IMG.baku.boulevard,
    lat: 40.4093,
    lng: 49.8671,
    distanceFromBaku: 0,
    featured: true,
  },
  {
    slug: "gence",
    name: "Gəncə",
    tagline: "Ölkənin ikinci böyük şəhəri, Nizaminin vətəni",
    description:
      "Gəncə qədim karvan yollarının üstündə yerləşən, min ildən artıq tarixə malik mədəniyyət paytaxtıdır. Böyük şair Nizami Gəncəvinin doğma şəhəri bu gün qırmızı kərpicli fasadlı Rəsulzadə küçəsi, möhtəşəm Cümə məscidi və əfsanəvi Butulka Evi ilə səyahətçiləri cəlb edir.",
    history:
      "Eramızın V–VI əsrlərində salınan Gəncə orta əsrlərdə Atabəylər dövlətinin ən əhəmiyyətli şəhərlərindən olub. 1139-cu il zəlzələsindən dağılan şəhər qısa müddətdə bərpa edilərək yenidən regionun ticarət mərkəzinə çevrildi. 1804-cü ildə rus işğalına qədər Gəncə xanlığının paytaxtı idi; həmin dövrün memarlığı bu gün şəhər mərkəzində hələ də yaşayır.",
    culture:
      "Gəncə Azərbaycanın 'müdriklik məktəbi' hesab olunur — burada şeir və ədəbiyyata hörmət xüsusilə güclüdür. Şəhər öz alma baqları, məşhur 'Gəncə lüləsi' qab-qacağı və qızılgül istehsalı ilə tanınır.",
    tips: [
      "Nizami Məqbərəsi şəhərdən 7 km kənardadır — taksi ilə 15 dəqiqəyə çatmaq olar.",
      "Rəsulzadə küçəsində axşam saatlarında işıqlandırma xüsusilə gözəldir.",
      "Butulka Evin sayı 48 mindən çoxdur — hər butulka yerli sənətkar tərəfindən əl ilə yapışdırılıb.",
    ],
    image: IMG.baku.bazaar2,
    lat: 40.6828,
    lng: 46.3606,
    distanceFromBaku: 375,
    featured: true,
  },
  {
    slug: "shusha",
    name: "Şuşa",
    tagline: "Qarabağın tacı, muğamın beşiyi",
    description:
      "Dağların zirvəsində, 1400 metr hündürlükdə yerləşən Şuşa Azərbaycan mədəniyyətinin simvoludur. Ümməni muğam məclislərinin, Xarıbülbül festivalının və Cıdır düzünün yurdu olan şəhər XVII əsrin qala divarları və Gövhar Ağa məscidi ilə nəfəs kəsir.",
    history:
      "1752-ci ildə Qarabağ xanı Pənahəli xan tərəfindən Pənahabad adı ilə salınan şəhər XVIII–XIX əsrlərdə Cənubi Qafqazın mədəni paytaxtına çevrildi. Burada Xurşidbanu Natəvan, Üzeyir Hacıbəyli və Bülbül kimi dahi şəxsiyyətlər dünyaya gəlib. 1992–2020-ci illərdə işğal altında qalan Şuşa 2020-ci ilin noyabrında azad edilib və bu gün bərpa işləri ilə yenidən yaşayır.",
    culture:
      "Şuşa 'Azərbaycan musiqisinin konservatoriyası' adlanır. Sənətkarlıq ustaları minillik ənənələr üzrə köndələn tumarları, mis basma qabları və meşər xalçaları toxumağa davam edirlər. May ayında keçirilən Xarıbülbül Beynəlxalq Folklor Festivalı şəhərin mənəvi simvoluna çevrilib.",
    tips: [
      "Şüaya yol yeməyərəkdən keçir — Füzuli–Şuşa yolundakı dağ mənzərələri üçün 1 saat əlavə vaxt ayırın.",
      "Cıdır düzündə gün batımı unudulmazdır; yay aylarında axşamlar sərin olur, gödəkçə götürün.",
      "Şəhərdə bərpa işləri davam edir — bəzi küçələr qapalı ola bilər, bələdçi ilə gəzmək məsləhətdir.",
    ],
    image: IMG.mountains.oghuz3,
    lat: 39.7583,
    lng: 46.7486,
    distanceFromBaku: 385,
    featured: true,
  },
  {
    slug: "qebele",
    name: "Qəbələ",
    tagline: "Dağ kurortları, şəlalələr və qədim alban irsi",
    description:
      "Böyük Qafqaz dağlarının ətəyində yerləşən Qəbələ ölkənin məşhur dağ kurort mərkəzidir. Tufandağ teleferiği, Nohur gölünün saf suyu, Yeddi Gözəl şəlaləsi və mövsümdən asılı olmayaraq işləyən beynəlxalq musiqi festivalı ilə hər yaşdan səyahətçi üçün ideal istirahət nöqtəsidir.",
    history:
      "Qədim Qəbələ — Qafqaz Albaniyasının 600 ildən artıq paytaxtı olmuş şəhərin xarabalıqları hal-hazırda arxeoloji kompleks kimi qorunur. Eramızdan əvvəl I əsrdən eramızın XI əsrinədək mövcud olan bu şəhər İpək Yolunun şimal qolunda mühüm ticarət məntəqəsi idi. Bu gün qazıntı yaxınlığında muzey və açıq səma altında sərgi fəaliyyət göstərir.",
    culture:
      "Qəbələ Beynəlxalq Musiqi Festivalı hər yay Üzeyir Hacıbəylinin xatirəsinə keçirilir və dünya şöhrətli ifaçıları bir araya gətirir. Bölgə həmçinin şərə xörəyi, dağ balı və şamandi şirniyyatları ilə məşhurdur.",
    tips: [
      "Tufandağ teleferiyinə biletləri onlayn öncədən alın — həftə sonları növbə uzun olur.",
      "Nohur gölündə qayıq icarəsi saatına 10–20 AZN təşkil edir.",
      "Yeddi Gözəl şəlaləsinə gedən yol daşlıdır; rahat idman ayaqqabısı geyinin.",
    ],
    image: IMG.mountains.oghuz1,
    lat: 40.9814,
    lng: 47.8459,
    distanceFromBaku: 220,
    featured: true,
  },
  {
    slug: "sheki",
    name: "Şəki",
    tagline: "Xan sarayları, karvansaraylar və şəbəkə sənəti",
    description:
      "Böyük Qafqazın cənub ətəyindəki Şəki XVIII əsrin memarlıq incilərini qoruyub saxlayan nadir şəhərlərdəndir. Şəki Xan Sarayının rəngarəng şəbəkə pəncərələri, daş karvansaraylar və dünyaca məşhur Şəki halvası şəhəri 2019-cu ildə UNESCO Ümumdünya İrsi siyahısına saldı.",
    history:
      "Şəki tarixi 2700 ildən artıqdır — burada İpək Yolunun ən mühüm karvansarayları yerləşirdi. XVIII əsrdə müstəqil Şəki xanlığının paytaxtı olan şəhər 1762-ci ildə məşhur Xan Sarayı ilə bəzədildi. Sovet dövründə ipəkçilik və tütün emalı mərkəzi kimi inkişaf edən Şəki bu gün sənətkarlıq ixtisasları ilə yaşayır.",
    culture:
      "Şəbəkə — taxta parçaları çivin və yapışqan istifadə etmədən birləşdirmə sənəti — Şəki ustalarının unikal bacarığıdır. Şəhər həmçinin 'piti' şorbasının və Şəki halvasının and yeridir; qonaqpərvərlik bürclərin ən yüksəyinə qaldırılıb: qonaq imkan daxilində ən yaxşı süfrə ilə qarşılanır.",
    tips: [
      "Xan Sarayına giriş biletini kiçik qida məntəqələrindən deyil, əsas kassadan alın — bələdçi xidməti daxildir.",
      "Aşağı Karvansarayın həyətində çay içmək pulsuzdur; burada gecələmək də mümkündür.",
      "Kiş kəndinə marşrut təxminən 30 dəqiqədir — avtobus Xan Sarayının yanından qalxır.",
    ],
    image: IMG.mountains.shekiTown,
    lat: 41.1919,
    lng: 47.1706,
    distanceFromBaku: 305,
    featured: true,
  },
  {
    slug: "lenkeran",
    name: "Lənkəran",
    tagline: "Subtropik meşələr, çay plantasiyaları və Xəzər sahili",
    description:
      "Talış dağları ilə Xəzər dənizi arasında yerləşən Lənkəran Azərbaycanın subtropik cennətidir. Nəm iqlim yarpağı dökməyən Hirkan meşələrini, limon və çay plantasiyalarını bəxəş edib. Ləvəngi, mərcan balığı və dfünə yarpaqlı südlü çay — yerli mətbəxin tacıdır.",
    history:
      "Arxeoloji qazıntılar göstərir ki, buradakı yaşayış tunc dövrünə gedib çıxır. XVIII əsrdə Talış xanlığının paytaxtı olan Lənkəran XIX əsrin sonlarında pambıq və ipək istehsalı ilə tanınırdı. Məşhur Dairəvi Qala (Zindan) XVIII əsrdə hərbi məqsədlə inşa edilib; deyilənə görə, burada general Kutuzov da saxlanılıb.",
    culture:
      "Lənkəran Talış mədəniyyətinin mərkəzidir — yerli sakinlər azərbaycan dilindən əlavə talış dilində də danışırlar. Mart-may ayları çay yığımı mövsümüdür; payızda isə nar bayramı keçirilir. Lənkəranlılar gülümsəyən üzləri və çay süfrəsinə hədsiz hörmətləri ilə tanınırlar.",
    tips: [
      "Hirkan Milli Parkına giriş icazə ilə olur — əvvəlcə rayon icra hakimiyyətindən icazə alın və ya tur şirkətinə müraciət edin.",
      "Ləvəngini (toyuq/balıq qoz mürəbbəsi ilə) yalnız yerli restoranlarda dadın — resept regiona xasdır.",
      "İyun-sentyabr arası dəniz mövsümüdür; sahildə suyun temperaturu 24–26°C olur.",
    ],
    image: IMG.mountains.riverbed,
    lat: 38.7529,
    lng: 48.85,
    distanceFromBaku: 265,
    featured: false,
  },
  {
    slug: "quba",
    name: "Quba",
    tagline: "Alma baqları, xalçaçılıq və Xınalığın zirvələri",
    description:
      "Şahdağın ətəyindəki Quba Azərbaycanın xalçaçılıq paytaxtıdır. 2360 metr hündürlükdə yerləşən qədim Xınalıq kəndi 2023-cü ildə UNESCO siyahısına daxil edilib. Qırmızı Qəsəbə isə dünyada yəhudi icmasının kompakt yaşadığı yeganə gənc kəndlərdən biridir.",
    history:
      "Quba xanlığı XVIII əsrdə güclü siyasi mərkəz idi; xan Hüseynəli xanın dövründə burada sənətkarlıq çiçəkləndi. Quba xalça məktəbi dünyanın ən qədim məktəblərindən sayılır — 'Quba-Qarabağ' və 'Çiçi' naxışları artıq XVI əsrin qaynaqlarında qeyd olunub. Xınalıq kəndi isə ehtimal ki, 4000 ildən çox yaşa malikdir.",
    culture:
      "Quba xalça ustaları hələ də əl işi toxuculuqla məşğuldur; hər evdə dörddərəcə naxışlı xalça görə bilərsiniz. Alma və qoz baqları rayon iqtisadiyyatının təməlidir — sentyabra 'Alma festivalı' keçirilir. Qırmızı Qəsəbədə dağ yəhudilərinin üç sinaqoqu fəaliyyət göstərir.",
    tips: [
      "Xınalığa yol yalnız yaxşı havada açıq olur — səyahətdən əvvəl rayon mərkəzində vəziyyəti yoxlayın.",
      "Qırmızı Qəsəbədə 'Sinaqoq yaxınlığındaki çayxana' ən yaxşı yerli dadları təqdim edir.",
      "Ən yaxşı xalça alış-verişi birbaşa toxucu ustaların emalatxanalarındandır.",
    ],
    image: IMG.mountains.khinalug,
    lat: 41.3611,
    lng: 48.5125,
    distanceFromBaku: 168,
    featured: true,
  },
  {
    slug: "khizi",
    name: "Xızı",
    tagline: "Alabaster dağlar və Mikayıl Müşfiqin vətəni",
    description:
      "Bakıya bir saatlıq məsafədə yerləşən Xızı ölkənin ən fotogenik təbii mənzərələrinə sahibdir. 'Candy Cane' ləqəbli alabaster dağlarının qırmızı-ağ zolaqları Mars landşaftını xatırladır. Altıağac Milli Parkı üçün yol bu rayon üzərindən keçir və burası elifi nəsnin vətənidir.",
    history:
      "Xızı qədim dövrlərdən Abşeron ilə şimal regionlarını birləşdirən keçid zonası olub. Rayon Azərbaycan klassik poeziyasının böyük nümayəndəsi, faciəli taleli şair Mikayıl Müşfiqin (1908–1938) doğma yurdudur. İkinci Dünya müharibəsi illərində burada mühüm hərbi-strateji obyektlər yerləşirdi.",
    culture:
      "Rayon iqtisadiyyatının əsası maldarlıq və əkinçilikdir. Yerlilər hər il Mayın 4-də 'Elif bayramı'nı qeyd edirlər; Giləzi çayxanaları yol üstündə dayanan sürücülərin ən sevimli dayanacağıdır.",
    tips: [
      "Candy Cane dağlarına ən yaxşı işıq səhər 07:00–09:00 və axşam 17:00-dan sonra düşür.",
      "Altıağac yolu sərt dağ yoludur — mürəkkəb hava şəraitində düşmən.",
      "Xızıda ATM məhduddur; nağd pul ehtiyatı ilə gəlin.",
    ],
    image: IMG.mountains.oghuz2,
    lat: 40.9106,
    lng: 49.0738,
    distanceFromBaku: 105,
    featured: false,
  },
  {
    slug: "shamakhi",
    name: "Şamaxı",
    tagline: "Şirvanşahların qədim paytaxtı və şərablıq tarixi",
    description:
      "Şirvan düzündə yerləşən Şamaxı min il Şirvanşahlar dövlətinin paytaxtı olmuş qədim şəhərdir. Yeddi Gümbəz türbələri, məşhur sakinləri — Xaqani və Səbir, həmçinin bölgənin şərablı üzüm bağları (Meysari) şəhərə xüsusi təbəssüm qatır.",
    history:
      "Şamaxı e.ə. II əsrdən məşhurdur; orta əsrlərdə Şirvanşahlar sarayının iqamətgahı idi. 1192-ci il güclü zəlzələ şəhəri demək olar ki, tamamilə dağıdıb və paytaxt Bakıya köçürülüb. XVIII–XIX əsrlərdə Şamaxı ipəkçilik və şərab istehsalı ilə yenidən qüvvət qazanıb.",
    culture:
      "Şamaxı Azərbaycan klassik ədəbiyyətının beşiyidir. Bu gün şəhər məşhur 'Şamaxı qovuğu' və 'Şirvan' şərabları ilə tanınır; Meysari kəndində bio-bağçılıq turizmi inkişaf edir.",
    tips: [
      "Yeddi Gümbəzə qalxan pilləkən yol olduqca dikdir — rahat ayaqqabı lazımdır.",
      "Şərab degustasiyası üçün Meysari-yə əvvəlcədən zəng edin.",
      "Cümə günü əsas məscidə daxil olarkən geyim qaydalarına riayət edin.",
    ],
    image: IMG.mountains.laza,
    lat: 40.6314,
    lng: 48.6414,
    distanceFromBaku: 120,
    featured: false,
  },
  {
    slug: "ismayilli",
    name: "İsmayıllı",
    tagline: "Lahıc misgərliyi, Basqal kelağayısı və dağ kəndləri",
    description:
      "Böyük Qafqazın cənub yamacındakı İsmayıllı dağ kənd mədəniyyətinin canlı muzeyidir. Lahıc — VII əsrdən mis qazan döymə sənəti ilə yaşayan tarixi kənd; Basqal isə ipək kelağayı bəzəkliyinin mərkəzidir. İvanovka isə dünyanın ən qayğıkeş molokan icmasına ev sahibliyi edir.",
    history:
      "Lahıc kəndinin ‘Lohan’ adlanan qədim hissəsi Sasani dövrünə aid edilir; kəndin küngüt kanalizasiya sistemi 1500 ildən çoxdur işləyir. XIX əsrdə İsmayıllı düzündən keçən karvan yolu Şamaxı ilə Şəki arasında əsas ticarət arteriyası idi. Molokanlar (slavyan dini icma) 1830-cu ildən bəri İvanovkada yaşayır.",
    culture:
      "Lahıc ustaları mis qabları hələ də ataları kimi — döymə, naxış vurma və qələm işi ilə hazırlayırlar. Basqal kelağayısı Azərbaycanın qeyri-maddi irs siyahısındadır. Molokan mətbəxinin 'patşa çörəyi' və südlü kartoflu yeməkləri yalnız burada dadıla bilər.",
    tips: [
      "Lahıca gedən yol çox döngəlidir — hərəkət xəstəliyi olanlar üçün həb götürün.",
      "Mis emalatxanalarında alış-veriş zamanı qiyməti mütləq soruşun — turistik qiymət fərqi ola bilər.",
      "İvanovkada samovar çayı içmək üçün əvvəlcədən icma evinə xəbər verin.",
    ],
    image: IMG.mountains.village,
    lat: 40.7897,
    lng: 48.1514,
    distanceFromBaku: 175,
    featured: false,
  },
];

const ATTRACTIONS: AttractionSeed[] = [
  // ---------- Bakı ----------
  { region: "baki", name: "Qız Qalası", type: "monument", ticket: 15, rating: 4.9, lat: 40.366, lng: 49.8375, image: IMG.baku.maidenSunset, description: "XII əsrə aid, 28 metrlik sirli qüllə — İçərişəhərin simvolu və UNESCO Ümumdünya İrsi obyekti. Maneqanın zirvəsindən köhnə şəhər və Xəzər panoraması açılır." },
  { region: "baki", name: "Şirvanşahlar Sarayı", type: "palace", ticket: 15, rating: 4.8, lat: 40.3665, lng: 49.833, image: IMG.baku.maidenAerial, description: "XV əsr Şirvanşahlar iqamətgahı — saray kompleksi, Divanxana, Seyid Yəhya Bakuvi türbəsi və ailə məscidindən ibarətdir. Azərbaycan orta əsr memarlığının ən yüksək nümunəsi." },
  { region: "baki", name: "Heydər Əliyev Mərkəzi", type: "museum", ticket: 12, rating: 4.8, lat: 40.3953, lng: 49.8669, image: IMG.baku.day, description: "Zaha Hadidin dünyaca məşhur layihəsi — axıcı xətləri ilə müasir memarlığın simvolu. Daxilində müasir incəsənət, xalq sənəti və dövlət tarixi sərgiləri yerləşir." },
  { region: "baki", name: "Bakı Bulvarı", type: "park", ticket: 0, rating: 4.9, lat: 40.368, lng: 49.845, image: IMG.baku.boulevard, description: "Xəzər sahil boyu uzanan 16 kilometrlik promenad — kiçik Venesiya kanalları, su idmanı, velosiped yolları və dəniz işığı ilə şəhərin ən sevimli gəzinti məkanı." },
  { region: "baki", name: "Alov Qüllələri", type: "monument", ticket: 0, rating: 4.8, lat: 40.356, lng: 49.8264, image: IMG.baku.flame2, description: "Üç alov formalı 182 metrlik göydələn — Bakının müasir simvolu. Gecələr 10 000 LED lampa ilə işıqlandırılır; Dağüstü parkdan ən yaxşı mənzərə açılır." },
  { region: "baki", name: "Azərbaycan Xalça Muzeyi", type: "museum", ticket: 10, rating: 4.7, lat: 40.3609, lng: 49.8354, image: IMG.baku.bazaar1, description: "Bükülmüş xalça formasında bina — 10 000-dən çox xalça, zili və sumax kolleksiyası ilə dünyada seçilən ixtisaslaşmış muzey. XIV əsr xalçalarından müasir ustaların işlərinə qədər." },
  { region: "baki", name: "Opera və Balet Teatrı", type: "theater", ticket: 20, rating: 4.7, lat: 40.377, lng: 49.853, image: IMG.hotel.room5, description: "1911-ci ildə açılan akademik teatr — Üzeyir Hacıbəylinin 'Leyli və Məcnun' operası burada premyera görüb. Binasının yüngül əfsanəvi arxitekturası Nikolai Bayevin işidir." },

  // ---------- Gəncə ----------
  { region: "gence", name: "Nizami Gəncəvi Məqbərəsi", type: "monument", ticket: 0, rating: 4.7, lat: 40.685, lng: 46.372, image: IMG.mountains.shekiTown, description: "Böyük şair Nizami Gəncəvinin xatirəsinə ucaldılan memarlıq kompleksi — 20 metrlik heykəl və qranit sütunlarla əhatə olunmuş park şəhərdən 7 km məsafədədir." },
  { region: "gence", name: "Cümə Məscidi (Şah Abbas)", type: "mosque", ticket: 0, rating: 4.8, lat: 40.6789, lng: 46.3534, image: IMG.mountains.oghuz3, description: "1606-cı ildə Şah Abbasın göstərişi ilə tikilmiş qırmızı kərpicli məscid — memar Şeyx Bəhaiəddinin əsəri. İki minarə və yuxarı günbəz kompozisiyası ilə seçilir." },
  { region: "gence", name: "Butulka Evi", type: "museum", ticket: 2, rating: 4.5, lat: 40.6743, lng: 46.352, image: IMG.baku.bazaar1, description: "İncəsənət xadimi İbrahim Cəfərovun 48 mindən çox şüşə butulka ilə bəzədiyi ev — Gəncənin ən fotogenik və qəribə attraksionu. Hər butulka əllə yapışdırılıb." },
  { region: "gence", name: "Xan Bağı", type: "park", ticket: 0, rating: 4.6, lat: 40.682, lng: 46.348, image: IMG.mountains.oghuz1, description: "XVIII əsr qədim xan bağı — Gəncə xanının iqamətgahının qalıqları, bulaqlı su kanalları və köhnə çinar ağacları ilə şəhərin yaşıl ciyəri." },

  // ---------- Şuşa ----------
  { region: "shusha", name: "Cıdır Düzü", type: "nature", ticket: 0, rating: 4.9, lat: 39.75, lng: 46.74, image: IMG.mountains.oghuz3, description: "Şuşanın cənubunda təbii dağ düzənliyi — tarixən at yarışları və Novruz bayramı məclisləri keçirilən məkan. Qarabağ xanlığının ən möhtəşəm təbii səhnəsi." },
  { region: "shusha", name: "Şuşa Qalası — Gəncə Qapısı", type: "monument", ticket: 0, rating: 4.8, lat: 39.762, lng: 46.752, image: IMG.mountains.oghuz2, description: "1752-ci ildə salınmış qala divarlarının əsas girişi — daşlı qübbəli qapı şəhərin müdafiə sisteminin qalan ən güclü hissəsidir." },
  { region: "shusha", name: "Yuxarı Gövhar Ağa Məscidi", type: "mosque", ticket: 0, rating: 4.8, lat: 39.76, lng: 46.749, image: IMG.mountains.laza, description: "1768-ci ildə Qarabağ xanının qızı Gövhar Ağa tərəfindən tikdirilən iki minarəli məscid — Şuşanın simvolu. İşğaldan sonra bərpa edilib və yenidən açılıb." },
  { region: "shusha", name: "M.P.Vaqif Məqbərəsi", type: "monument", ticket: 0, rating: 4.7, lat: 39.759, lng: 46.751, image: IMG.mountains.oghuz1, description: "Qarabağ xanlığının böyük şairi Molla Pənah Vaqifin xatirəsinə ucaldılan ağ mərmər kompleks — dağ terrasından Daşaltı çayı görsənir." },

  // ---------- Qəbələ ----------
  { region: "qebele", name: "Tufandağ Dağ Kurortu", type: "nature", ticket: 25, rating: 4.8, lat: 40.966, lng: 47.852, image: IMG.mountains.oghuz1, description: "4 kabel yolu xətti ilə dağ zirvələrinə qaldıran kurort — qışda xizək, yayda isə paraplan və dağ velosipedi. Zirvədə 'Demirçi' mənzərə nöqtəsi 2200 metr hündürlükdədir." },
  { region: "qebele", name: "Yeddi Gözəl Şəlaləsi", type: "nature", ticket: 0, rating: 4.7, lat: 40.922, lng: 47.802, image: IMG.mountains.riverbed, description: "Vəndam kəndi yaxınlığında yeddi pillədən ibarət dağ şəlaləsi — adını hər pillədə suyun yaratdığı yeddi gözəldən alıb. Bulaq suyu çox soyuqdur, ayaqqabı dəyişin." },
  { region: "qebele", name: "Nohurqışlaq Gölü", type: "nature", ticket: 0, rating: 4.6, lat: 40.976, lng: 47.854, image: IMG.mountains.oghuz3, description: "Dağların arasında süni amma təbii görünən sakit göl — qayıq və katamaran icarəsi, sahilində restoranlar yerləşir. Sübh saatında dumanlı mənzərə məşhurdur." },
  { region: "qebele", name: "Qədim Qəbələ Arxeoloji Kompleksi", type: "monument", ticket: 3, rating: 4.5, lat: 40.99, lng: 47.8, image: IMG.mountains.oghuz2, description: "Qafqaz Albaniyasının paytaxtının qalıqları — açıq səma altında qazıntı sahəsi və kiçik muzey. İki min illik yaşayış izləri hələ də davam edən qazıntılarla üzə çıxır." },

  // ---------- Şəki ----------
  { region: "sheki", name: "Şəki Xan Sarayı", type: "palace", ticket: 5, rating: 4.9, lat: 41.2035, lng: 47.1912, image: IMG.mountains.shekiTown, description: "1762-ci ildə tikilmiş iki mərtəbəli saray — şəbəkə üsulu ilə hazırlanmış 14 000 kiçik şüşə parçadan ibarət rəngarəng pəncərələrlə dünyada seçilir. UNESCO Ümumdünya İrsi obyekti." },
  { region: "sheki", name: "Yuxarı Karvansaray", type: "monument", ticket: 0, rating: 4.7, lat: 41.1972, lng: 47.17, image: IMG.baku.bazaar2, description: "XVIII əsr daş karvansarayı — 242 otaq, böyük həyət və yeraltı hamam ilə hələ də mehmanxana kimi işləyir. Həyətdə çayxana səfərbərdir." },
  { region: "sheki", name: "Kiş Alban Məbədi", type: "monument", ticket: 2, rating: 4.8, lat: 41.245, lng: 47.197, image: IMG.mountains.oghuz1, description: "I əsrdən mövcud olan qədim Qafqaz Albaniya kilsəsi — Şəkidən 7 km məsafədəki Kiş kəndində yerləşir. Norveç alimi Tur Heyerdalın tədqiqatları ilə məşhurlaşıb." },
  { region: "sheki", name: "Şəki Tarix-Diyarşünaslıq Muzeyi", type: "museum", ticket: 3, rating: 4.5, lat: 41.198, lng: 47.169, image: IMG.baku.maidenCloud, description: "Qədim kilsə binasında yerləşən muzey — arxeoloji tapıntılar, xalq sənəti nümunələri və Şəki xanlığı dövrünün sənədləri. Ziyarət 45 dəqiqə çəkir." },

  // ---------- Lənkəran ----------
  { region: "lenkeran", name: "Dairəvi Qala (Zindan)", type: "monument", ticket: 0, rating: 4.4, lat: 38.754, lng: 48.851, image: IMG.mountains.riverbed, description: "XVIII əsr dairəvi daş qala — Talış xanlığının zindanı olub; deyilənə görə, general Kutuzov burada həbsə məruz qalıb. Hazırda bərpa işləri davam edir." },
  { region: "lenkeran", name: "Hirkan Milli Parkı", type: "nature", ticket: 5, rating: 4.8, lat: 38.633, lng: 48.783, image: IMG.mountains.oghuz2, description: "Yarpağı dökməyən relikt meşələr — dəmir ağacı, Hirkan banbanı və acıca qaragacı ilə 2 milyon illik təbii irs. Bələdçi ilə gəzinti məsləhətdir." },
  { region: "lenkeran", name: "Lənkəran Bulvarı", type: "park", ticket: 0, rating: 4.6, lat: 38.746, lng: 48.862, image: IMG.baku.boulevard, description: "Xəzər sahilində çinar və forsitiya kölgəlikli promenad — axşamlar ailələr üçün əsas gəzinti yeridir. Yayda dəniz suyu park otaq istiliyindədir." },
  { region: "lenkeran", name: "Xan Evi — Tarix Muzeyi", type: "museum", ticket: 3, rating: 4.3, lat: 38.753, lng: 48.849, image: IMG.hotel.room3, description: "XIX əsr xan iqamətgahında tarix muzeyi — Talış xanlığı dövrünün əşyaları, qədim əlyazmalar və qızıl suvaq naxışlı divarlar saxlanılıb." },

  // ---------- Quba ----------
  { region: "quba", name: "Xınalıq Kəndi", type: "monument", ticket: 0, rating: 4.9, lat: 41.178, lng: 48.127, image: IMG.mountains.khinalug, description: "Dəniz səviyyəsindən 2360 metr yüksəkdə, buludların üstündə 4000 illik kənd — öz dilində danışan xınalıqlıların evi daş üstündə daşdır. 2023-cü ildən UNESCO Ümumdünya İrsi." },
  { region: "quba", name: "Qırmızı Qəsəbə", type: "monument", ticket: 0, rating: 4.7, lat: 41.367, lng: 48.508, image: IMG.baku.bazaar1, description: "Dünyada yəhudilərin kompakt yaşadığı yeganə gənc dağ kəndi — üç fəal sinaqoq, qədim qəbiristanlıq və Cənubi Qafqazda yəhudi mədəniyyətinin canlı nümunəsi." },
  { region: "quba", name: "Təngəaltı Kanyonu", type: "nature", ticket: 0, rating: 4.6, lat: 41.33, lng: 48.3, image: IMG.mountains.oghuz1, description: "Qudyalçay üzərində 400–600 metr dərinlikdə daş kanyon — yerli adı ilə 'Təngəaltı' çay kəsikli qayalarla çoxillik yeraltı su yolunun nəticəsidir." },
  { region: "quba", name: "Quba Xalçaçılıq Mərkəzi", type: "museum", ticket: 3, rating: 4.5, lat: 41.362, lng: 48.514, image: IMG.baku.bazaar2, description: "Canlı toxuculuq emalatxanası və muzey — quba xalça məktəbinin naxışları ilə əl işi xalçaların hazırlanma prosesini yaxından izləyə bilərsiniz." },

  // ---------- Xızı ----------
  { region: "khizi", name: "Candy Cane Dağları", type: "nature", ticket: 0, rating: 4.7, lat: 40.98, lng: 49.03, image: IMG.mountains.oghuz2, description: "Qırmızı-ağ-qəhvəyi zolaqlı alabaster dağ silsiləsi — 'confeti dağlar' ləqəbi ilə Instagramda viral olan Azərbaycanın ən fotogenik təbii görüntüsü." },
  { region: "khizi", name: "Altıağac Milli Parkı", type: "nature", ticket: 2, rating: 4.5, lat: 40.92, lng: 48.89, image: IMG.mountains.oghuz1, description: "11 035 hektar dağ-meşə massivi — nadir bitki və heyvan növləri ilə təbiət turizminin yeni ünvanı. Yaylaq yolları yalnız avqust-sentyabrda keçərli olur." },
  { region: "khizi", name: "Mikayıl Müşfiq Ev Muzeyi", type: "museum", ticket: 2, rating: 4.2, lat: 40.9106, lng: 49.0738, image: IMG.hotel.room6, description: "Böyük Azərbaycan şairinin doğulduğu evdə kiçik memorial muzey — şəxsi əşyaları, əlyazmaları və 'Yalları' şeirlərinin orijinal kopyaları saxlanılır." },

  // ---------- Şamaxı ----------
  { region: "shamakhi", name: "Yeddi Gümbəz Türbələri", type: "monument", ticket: 3, rating: 4.6, lat: 40.64, lng: 48.62, image: IMG.mountains.oghuz3, description: "XVIII əsr Şirvanşahlar ailəsinin yeddi günbəzli memorial kompleksi — hazırda üç türbə tam saxlanılıb. Tepe mövqeyindən Şamaxı panoraması açılır." },
  { region: "shamakhi", name: "Şamaxı Cümə Məscidi", type: "mosque", ticket: 0, rating: 4.7, lat: 40.628, lng: 48.638, image: IMG.mountains.laza, description: "743-cü ildən mövcud olan Azərbaycanın ən qədim məscidi — 1860-cı ildə rus memar tərəfindən yenidən qurulub. Tənbəl xətti üzərindəki günbəz kompozisiyası ilə seçilir." },
  { region: "shamakhi", name: "Nəsəddin Tusi Rəsədxanası", type: "museum", ticket: 5, rating: 4.7, lat: 40.78, lng: 48.6, image: IMG.baku.day, description: "Pirqulu dağının zirvəsindəki (2200 m) Astrofizika Rəsədxanası — 2 metrlik reflektor teleskop Şərqi Avropanın ən böyüklərindəndir. Ekskursiya əvvəlcədən sifarişlə olur." },

  // ---------- İsmayıllı ----------
  { region: "ismayilli", name: "Lahıc Kəndi", type: "monument", ticket: 0, rating: 4.9, lat: 40.849, lng: 48.383, image: IMG.mountains.village, description: "Girdman çayının sahilində VII əsr misqərlik mərkəzi — daş küçələr, əl işi mis emalatxanaları və tunc acemi məscidi ilə canlı muzey. Kəndin kanalizasiya sistemi 1500 ildir işləyir." },
  { region: "ismayilli", name: "Basqal Kəndi", type: "nature", ticket: 0, rating: 4.7, lat: 40.761, lng: 48.402, image: IMG.mountains.oghuz1, description: "İpək kelağayı toxuculuğunun vətəni — XV əsr metodu ilə hazırlanan eşarplar hər evdə satılır. Kəndin köhnə hamamı və fəhrovqa qalası qalıqları gəzintiyə dəyər." },
  { region: "ismayilli", name: "İvanovka Molokan Kəndi", type: "park", ticket: 0, rating: 4.5, lat: 40.749, lng: 48.032, image: IMG.mountains.oghuz3, description: "1830-cu ildə məskunlaşmış rus molokan icmasının kəndi — südlərin, samovar çayının və 'patşa çörəyinin' məşhur diyarı. İcma evində sirniyyat yarmarkası fəaliyyət göstərir." },
];

const VENUES: VenueSeed[] = [
  // ---------- Bakı: Otellər ----------
  { region: "baki", name: "Fairmont Baku — Flame Towers", category: "hotel", priceLevel: 3, avgPrice: 290, rating: 4.8, reviews: 2140, hours: "24 saat", phone: "+994 12 565 48 48", lat: 40.356, lng: 49.8264, image: IMG.hotel.room1, featured: true, address: "Mehdi Hüseyn küç. 1A, Alov Qüllələri", description: "Alov Qüllələrində 5 ulduzlu dəbdəbə — Xəzər panoramalı otaqlar, ESPA spası, 3 restoran və qonaqpərvər komanda ilə paytaxtın ən seçilən oteli.", amenities: ["SPA və hovuz", "Xəzər mənzərəsi", "Restoran", "Wi-Fi", "Fitnes", "Konfrans zalı"] },
  { region: "baki", name: "Four Seasons Hotel Baku", category: "hotel", priceLevel: 3, avgPrice: 365, rating: 4.9, reviews: 1865, hours: "24 saat", phone: "+994 12 404 24 24", lat: 40.364, lng: 49.837, image: IMG.hotel.room2, featured: true, address: "Neftçilər pr. 1", description: "Bulvar üstündə beşulduzlu zirvə — İçərişəhərə birbaşa baxış, cənubi fransız dekoru və dünyaca tanınan Jaleh SPA ilə premium səyahət təcrübəsi.", amenities: ["SPA", "Hovuz", "Xəzər mənzərəsi", "Uşaq klubu", "Vale parkinq"] },
  { region: "baki", name: "Shah Palace Hotel", category: "hotel", priceLevel: 2, avgPrice: 128, rating: 4.6, reviews: 940, hours: "24 saat", phone: "+994 12 497 30 51", lat: 40.3662, lng: 49.8336, image: IMG.hotel.room3, address: "İçərişəhər, Kiçik Qala küç. 66", description: "Şirvanşahlar Sarayına 2 dəqiqəlik məsafədə butik otel — tarixi dekor, səhər yeməyi daxil və İçərişəhərin sakit küçələrində mövqe.", amenities: ["Səhər yeməyi", "Wi-Fi", "Tarixi mərkəz", "Terras"] },
  { region: "baki", name: "Old City Boutique Hotel", category: "hotel", priceLevel: 1, avgPrice: 62, rating: 4.4, reviews: 612, hours: "24 saat", phone: "+994 12 437 00 11", lat: 40.3655, lng: 49.8318, image: IMG.hotel.room4, address: "A. Zeynallı küç. 25", description: "Büdcə dostu kiçik butik otel — təmiz otaqlar, isti su və İçərişəhərə piyada 5 dəqiqə. Gənc səyahətçilər üçün ideal seçim.", amenities: ["Səhər yeməyi", "Wi-Fi", "Piyada məsafə"] },

  // ---------- Bakı: Restoranlar ----------
  { region: "baki", name: "Firuze Restoranı", category: "restaurant", priceLevel: 2, avgPrice: 32, rating: 4.7, reviews: 1521, hours: "11:00–23:00", phone: "+994 12 598 18 42", lat: 40.3768, lng: 49.8492, image: IMG.food.feast, featured: true, address: "T. Əliyarbəyov küç. 14", description: "Milli mətbəxin klassikası — aşıq mətbəxi, şah plovu və dərə kebabı ilə tanınan ailə restoranı. Canlı muğam axşamları ilə məşhurdur.", amenities: ["Milli mətbəx", "Canlı musiqi", "Terras", "Ailəvi"] },
  { region: "baki", name: "Dolma Restoranı", category: "restaurant", priceLevel: 1, avgPrice: 18, rating: 4.6, reviews: 1234, hours: "10:00–22:30", phone: "+994 12 493 70 38", lat: 40.3737, lng: 49.841, image: IMG.food.dolma1, address: "Fəzail Bayramov küç. 22", description: "Fəvvarələr meydanında həmişə canlı kiçik restoran — üçbacalı dolması və soyutması ilə tələsik nahar üçün ideal qiymət-keyfiyyət balansı.", amenities: ["Sürətli servis", "Milli mətbəx", "Wi-Fi"] },
  { region: "baki", name: "Şirvanşah Muzey-Restoran", category: "restaurant", priceLevel: 3, avgPrice: 58, rating: 4.8, reviews: 896, hours: "12:00–24:00", phone: "+994 12 492 66 24", lat: 40.373, lng: 49.8478, image: IMG.food.grape, featured: true, address: "S. Rüstəm küç. 8", description: "Tarix və qastronomiyanın teatrı — hər otağ fərqli dövrü təmsil edir, menyuda unudulmuş saray reseptləri var. Böyük bayram süfrələri üçün rezervasiya mütləqdir.", amenities: ["Muzey konsepti", "Saray reseptləri", "VIP otaqlar", "Canlı muğam"] },
  { region: "baki", name: "Qaynana Restoranı", category: "restaurant", priceLevel: 2, avgPrice: 24, rating: 4.7, reviews: 743, hours: "10:00–23:00", phone: "+994 50 555 23 45", lat: 40.374, lng: 49.835, image: IMG.food.bowl, address: "S. Vurğun küç. 30", description: "'Evdəkimu' dadlar — qaynana əli ilə hazırlanmış ləpə aşığı, dovğa və dəyirmən qızartması. Az miqdarda masa, çoxlu isti qarşılama.", amenities: ["Ev yeməkləri", "Vegetarian seçimlər", "Ailəvi"] },

  // ---------- Bakı: Kafelər ----------
  { region: "baki", name: "Çay Evi 145", category: "cafe", priceLevel: 1, avgPrice: 9, rating: 4.5, reviews: 512, hours: "08:00–23:00", phone: "+994 55 555 14 05", lat: 40.382, lng: 49.852, image: IMG.tea.ceremony, address: "İ. Qutqaşınlı küç. 9A", description: "Armudu stəkan ənənəsinin modern təfsiri — 40 çeşid çay, nar mürəbbəsi və yarpaq xəngəli ilə səhərdən gecəyə açıq səmərəli məkan.", amenities: ["40+ çay çeşidi", "Mürəbbə", "Wi-Fi", "Kitab rəfi"] },
  { region: "baki", name: "Baku Roasting Company", category: "cafe", priceLevel: 2, avgPrice: 13, rating: 4.6, reviews: 655, hours: "08:00–20:00", phone: "+994 12 555 78 90", lat: 40.379, lng: 49.848, image: IMG.tea.kettle, address: "R. Rəsulzadə küç. 9", description: "Yerli qovurma zavodu — specialty qəhvə və fermer əməkdaşlığı ilə azərbaycanlı baristaların hazırladığı məşhur qırmızı fincan kofe.", amenities: ["Specialty qəhvə", "Şirniyyat", "Remote iş"] },

  // ---------- Bakı: Marketlər ----------
  { region: "baki", name: "Bravo Supermarket — 28 Mall", category: "supermarket", priceLevel: 1, avgPrice: 22, rating: 4.3, reviews: 1890, hours: "08:00–23:00", phone: "+994 12 310 28 28", lat: 40.3796, lng: 49.8484, image: IMG.market.aisle1, address: "Azadlıq pr. 15B, 28 Mall", description: "Şəhər mərkəzində tam təchizatlı supermarket — yerli meyvə-tərəvəz, hazır yemək bölməsi və Azərbaycan şirniyyatları stendi ilə səyahət ehtiyatları üçün rahat.", amenities: ["Hazır yemək", "Ödənişsiz çatdırılma", "24/7 deyil"] },
  { region: "baki", name: "Bazarstore — Port Baku", category: "supermarket", priceLevel: 3, avgPrice: 55, rating: 4.6, reviews: 730, hours: "09:00–22:00", phone: "+994 12 464 43 00", lat: 40.377, lng: 49.86, image: IMG.market.stocked, address: "Neftçilər pr. 153, Port Baku Mall", description: "Premium ərzaq bazarı — idxal pendirlər, delikates və yerli fermer məhsulları. Hədiyyəlik qutular və regional souse kolleksiyası ilə məşhurdur.", amenities: ["Premium seçim", "Şərab bölməsi", "Fermer məhsulları"] },
  { region: "baki", name: "Araz Supermarket — Nizami", category: "supermarket", priceLevel: 1, avgPrice: 18, rating: 4.2, reviews: 1240, hours: "08:00–23:00", phone: "+994 12 555 30 30", lat: 40.381, lng: 49.838, image: IMG.market.aisle2, address: "Nizami küç. 203B", description: "Yerli şəbəkənin ən böyük filialı — büdcə qiymətlər, geniş ərzaq sıralaması və gündəlik endirim kampaniyaları.", amenities: ["Büdcə qiymət", "Öz çörək sexi", "Parkinq"] },
  { region: "baki", name: "Yaşıl Bazar", category: "store", priceLevel: 1, avgPrice: 25, rating: 4.5, reviews: 980, hours: "06:00–19:00", phone: "+994 55 555 40 40", lat: 40.4025, lng: 49.826, image: IMG.baku.bazaar2, address: "Xətai pr. 15", description: "Əfsanəvi 'Yaşıl' — qurudulmuş meyvələr, toyuq pendiri, bal və mürəbbə ilə dolu tarixi bazar. Türk, ərəb və yerli məhsulların arealında alış-veriş turistik təcrübəyə çevrilir.", amenities: ["Tarixi bazar", "Məzə satışı", "Mürəbbə və bal"] },

  // ---------- Gəncə ----------
  { region: "gence", name: "Ganja Hotel", category: "hotel", priceLevel: 2, avgPrice: 95, rating: 4.5, reviews: 680, hours: "24 saat", phone: "+994 22 250 50 05", lat: 40.6857, lng: 46.3722, image: IMG.hotel.room5, address: "Nizami küç. 207", description: "Şəhər mərkəzində müasir otel — Cavadxan küçəsinə 5 dəqiqə, biznes mərkəzi və geniş konfrans imkanları ilə şəhərin əsas mehmanxanası.", amenities: ["Mərkəzi mövqe", "Restoran", "Fitnes", "Wi-Fi"] },
  { region: "gence", name: "Ramada Plaza Ganja", category: "hotel", priceLevel: 3, avgPrice: 150, rating: 4.6, reviews: 540, hours: "24 saat", phone: "+994 22 265 55 55", lat: 40.6712, lng: 46.3563, image: IMG.hotel.room6, address: "H. Əliyev pr. 259", description: "Beynəlxalq şəbəkə standartı — böyük hovuz, SPA və şəhərə panoramik baxan üst mərtəbə restoranı ilə Gəncənin premium seçimi.", amenities: ["Hovuz", "SPA", "Panoramik restoran", "Parkinq"] },
  { region: "gence", name: "Şah Bulaq Restoranı", category: "restaurant", priceLevel: 2, avgPrice: 22, rating: 4.6, reviews: 540, hours: "10:00–23:00", phone: "+994 22 241 40 40", lat: 40.6805, lng: 46.3571, image: IMG.food.dolma2, address: "Cavadxan küç. 7", description: "Gəncənin məşhur ailəvi restoranı — dovğa, pakhlava və Kür balığı ilə tanınır. Yayda həyət altında koshk süfrəsi qurulur.", amenities: ["Milli mətbəx", "Həyət", "Ailəvi"] },
  { region: "gence", name: "Xan Bağı Restoranı", category: "restaurant", priceLevel: 2, avgPrice: 20, rating: 4.5, reviews: 430, hours: "11:00–22:00", phone: "+994 55 555 60 60", lat: 40.6823, lng: 46.3488, image: IMG.food.meze, address: "Xan Bağı parkı yanı", description: "Tarixi Xan Bağının ərazisində açıq hava restoranı — çinar kölgəsində lülə-kabab və plov. Yay üçün idealdır.", amenities: ["Park mənzərəsi", "Kabab", "Açıq hava"] },
  { region: "gence", name: "Köhnə Gəncə Çayxanası", category: "cafe", priceLevel: 1, avgPrice: 6, rating: 4.4, reviews: 380, hours: "07:00–22:00", phone: "+994 55 555 61 61", lat: 40.676, lng: 46.3545, image: IMG.tea.rustic, address: "Ş. İ. Xətai küç. 12", description: "Qədim çayxana atmosferi — şəkər qaynadılmış çay, yarpaq xəngəli və yerli ahəng. Səhər 9-a qədər yer tapsız qalır.", amenities: ["Ənənəvi çay", "Xəngəl", "Tarixi interior"] },
  { region: "gence", name: "Bravo — Gəncə Mall", category: "supermarket", priceLevel: 1, avgPrice: 20, rating: 4.2, reviews: 860, hours: "09:00–22:00", phone: "+994 22 555 70 70", lat: 40.6689, lng: 46.395, image: IMG.market.dairy, address: "H. Əliyev pr., Gəncə Mall", description: "Əsas ticarət mərkəzindəki supermarket — səyahət üçün standart ehtiyatlar, uşaq şirniyyatları və sərnişin xidməti.", amenities: ["Mall içində", "Standart seçim", "Endirimlər"] },
  { region: "gence", name: "Gəncə Mall", category: "store", priceLevel: 2, avgPrice: 40, rating: 4.3, reviews: 720, hours: "10:00–22:00", phone: "+994 22 555 80 80", lat: 40.6695, lng: 46.396, image: IMG.market.aisle1, address: "H. Əliyev pr. 201", description: "Rayonun ən böyük ticarət mərkəzi — beynəlxalq geyim brendləri, uşaq əyləncə zonası və food court ilə ailəvi gün sonu.", amenities: ["Brendlər", "Food court", "Uşaq zonası"] },

  // ---------- Şuşa ----------
  { region: "shusha", name: "Xarıbülbül Hotel Şuşa", category: "hotel", priceLevel: 2, avgPrice: 85, rating: 4.5, reviews: 210, hours: "24 saat", phone: "+994 26 555 01 01", lat: 39.76, lng: 46.7465, image: IMG.hotel.room3, address: "Şuşa şəhəri, G. Zakir küç.", description: "Bərpa olunmuş tarixi binada butik otel — Cıdır düzünə piyada məsafə, muğam meyxana axşamları və dağ havası ilə dolu səhər yeməyi.", amenities: ["Tarixi bina", "Səhər yeməyi", "Bələdçi xidməti"] },
  { region: "shusha", name: "Şuşa Boutique Hotel", category: "hotel", priceLevel: 2, avgPrice: 75, rating: 4.3, reviews: 120, hours: "24 saat", phone: "+994 26 555 02 02", lat: 39.7575, lng: 46.7515, image: IMG.hotel.room4, address: "Şuşa şəhəri, mərkəz", description: "Yeni bərpa zonasında rahat 4 ulduz ekvivalenti — 15 otaq, yerli sənətkarların rəsmləri ilə bəzədilmiş zal.", amenities: ["Butik", "Sənət kolleksiyası", "Wi-Fi"] },
  { region: "shusha", name: "Cıdır Restoranı", category: "restaurant", priceLevel: 2, avgPrice: 25, rating: 4.6, reviews: 320, hours: "11:00–22:00", phone: "+994 26 555 03 03", lat: 39.7512, lng: 46.7405, image: IMG.food.feast, address: "Cıdır düzü yolu", description: "Cıdır düzünün kənarında daş tikili — Qarabağ kababı, tandır çörəyi və buğda plovu. Yayda açıq terrasda süfrə açılır.", amenities: ["Dağ mənzərəsi", "Tandır", "Qarabağ mətbəxi"] },
  { region: "shusha", name: "Şuşa Çay Evi", category: "cafe", priceLevel: 1, avgPrice: 7, rating: 4.5, reviews: 240, hours: "08:00–21:00", phone: "+994 26 555 04 04", lat: 39.7595, lng: 46.7488, image: IMG.tea.ceremony, address: "H. Cavid parkı yanı", description: "Kiçik amma ruhlu çay evi — müəllimin əli ilə dəmlənən dağ otları çayı, Xarıbülbül mürəbbəsi və şəhər tarixçəsindən canlı söhbətlər.", amenities: ["Dağ otları", "Yerli mürəbbə", "Bələdçi tövsiyələri"] },

  // ---------- Qəbələ ----------
  { region: "qebele", name: "Qafqaz Tufandağ Mountain Resort", category: "hotel", priceLevel: 3, avgPrice: 190, rating: 4.7, reviews: 560, hours: "24 saat", phone: "+994 24 205 40 40", lat: 40.9665, lng: 47.8525, image: IMG.hotel.room1, featured: true, address: "Tufandağ kompleksi, Durca kəndi", description: "Teleferiyə birbaşa çıxışlı dağ oteli — qışda ayaqqabı otaqlı xizək girişi, yayda dağ terrasları və ailəvi aktivliklər mərkəzi.", amenities: ["Teleferiyə giriş", "Xizək", "Hovuz", "Uşaq klubu"] },
  { region: "qebele", name: "Qafqaz Riverside Resort Hotel", category: "hotel", priceLevel: 3, avgPrice: 245, rating: 4.8, reviews: 480, hours: "24 saat", phone: "+994 24 205 41 41", lat: 40.971, lng: 47.861, image: IMG.hotel.room2, address: "Qəbələ–Vəndam yolu", description: "Çay sahilində geniş kurort — atçılıq, su parkı və bələdçili dağ turları ilə sectorun ən geniş xidmət spektrinə sahib otel.", amenities: ["Atçılıq", "Su parkı", "Tur xidməti", "SPA"] },
  { region: "qebele", name: "Qəbələ Garden Hotel", category: "hotel", priceLevel: 2, avgPrice: 115, rating: 4.5, reviews: 400, hours: "24 saat", phone: "+994 24 205 42 42", lat: 40.983, lng: 47.8472, image: IMG.hotel.room5, address: "İ. Qutqaşınlı küç. 34", description: "Şəhər mərkəzində sakit bağlarla əhatə olunmuş otel — teleferiyə 10 dəqiqə, Nohur gölünə isə 15 dəqiqə yol.", amenities: ["Bağ", "Səhər yeməyi", "Parkinq"] },
  { region: "qebele", name: "Nohur Göl Restoranı", category: "restaurant", priceLevel: 2, avgPrice: 28, rating: 4.6, reviews: 410, hours: "10:00–23:00", phone: "+994 24 555 50 50", lat: 40.9765, lng: 47.8545, image: IMG.food.dolma2, address: "Nohurqışlaq, göl sahili", description: "Göl haqqında su üstü terras — şərə xörəyi, dağ balığı qızartması və gün batımı ilə birgə süfrə.", amenities: ["Göl mənzərəsi", "Dağ balığı", "Terras"] },
  { region: "qebele", name: "Araz Supermarket Qəbələ", category: "supermarket", priceLevel: 1, avgPrice: 17, rating: 4.1, reviews: 300, hours: "08:00–22:00", phone: "+994 24 555 51 51", lat: 40.9818, lng: 47.8463, image: IMG.market.stocked, address: "H. Əliyev pr. 41", description: "Şəhərin əsas ərzaq mərkəzi — dağ ət məhsulları, Nohur balı və yol üçün isti çörək bölməsi.", amenities: ["Yerli məhsullar", "Çörək", "Yol dəsti"] },

  // ---------- Şəki ----------
  { region: "sheki", name: "Şəki Saray Hotel", category: "hotel", priceLevel: 2, avgPrice: 110, rating: 4.6, reviews: 390, hours: "24 saat", phone: "+994 24 244 81 81", lat: 41.1935, lng: 47.1695, image: IMG.hotel.room3, featured: true, address: "M. Rəsulzadə küç. 5", description: "Xan Sarayına piyada 10 dəqiqə — ənənəvi fasad, döşəməaltı istilik və şəhərə baxan səhər yeməyi zalı ilə şəhərin ən sevilən oteli.", amenities: ["Mərkəzi mövqe", "Ənənəvi dekor", "Restoran"] },
  { region: "sheki", name: "Marxal Resort & SPA", category: "hotel", priceLevel: 3, avgPrice: 175, rating: 4.7, reviews: 340, hours: "24 saat", phone: "+994 24 255 25 25", lat: 41.211, lng: 47.1805, image: IMG.hotel.room2, address: "Şəki–Kiş yolu", description: "Dağ yamacında hər şey daxil premium kompleks — SPA, hovuzlar, restoran 'Şirvan' və Kiş kəndinə panoramik baxış.", amenities: ["SPA", "Hovuzlar", "All-inclusive", "Panorama"] },
  { region: "sheki", name: "Qaqarin Restoranı", category: "restaurant", priceLevel: 1, avgPrice: 16, rating: 4.7, reviews: 520, hours: "09:00–22:00", phone: "+994 24 244 45 45", lat: 41.1958, lng: 47.1645, image: IMG.food.bowl, featured: true, address: "C. Məmmədquluzadə küç.", description: "Şəkinin əfsanəvi piti evi — gil qabda yuxarıdan tökülən bulionlu piti, yanında soğan və sumax. Yerli sakinlərin nahar məkanı, səs-küylü və canlı.", amenities: ["Piti", "Yerli atmosfer", "Büdcə"] },
  { region: "sheki", name: "Şəki Halva Evi", category: "cafe", priceLevel: 1, avgPrice: 8, rating: 4.8, reviews: 610, hours: "08:00–21:00", phone: "+994 55 555 88 88", lat: 41.1968, lng: 47.171, image: IMG.tea.kettle, address: "M. Axundov pr. 12", description: "Meşhur Şəki halvasının istehsal evi — dükan, çay otağı və kamera arxası hazırlanma prosesi. Çay ilə halva dəsti 8 AZN.", amenities: ["Halva istehsalı", "Çay otağı", "Hədiyyəlik qutular"] },
  { region: "sheki", name: "Bravo Supermarket Şəki", category: "supermarket", priceLevel: 1, avgPrice: 17, rating: 4.2, reviews: 340, hours: "08:00–22:00", phone: "+994 24 555 90 90", lat: 41.1902, lng: 47.168, image: IMG.market.aisle2, address: "O. Feyzullayev küç. 27", description: "Şəhər mərkəzində tam supermarket — ipək yolu səyahətçiləri üçün su, qəlyanaltı və yerli pendir seçimi.", amenities: ["Mərkəzdə", "Yerli məhsullar"] },

  // ---------- Lənkəran ----------
  { region: "lenkeran", name: "Qala Hotel Lənkəran", category: "hotel", priceLevel: 2, avgPrice: 80, rating: 4.4, reviews: 260, hours: "24 saat", phone: "+994 25 255 15 15", lat: 38.7538, lng: 48.8512, image: IMG.hotel.room4, address: "İ. Nəcəfov küç. 7", description: "Dairəvi Qalanın qarşısında şəhər oteli — bulvara 10 dəqiqə, dəniz məhsulları restoranı və güclü kondisionerlər ilə subtropik yayın qurtuluşu.", amenities: ["Mərkəzdə", "Restoran", "Wi-Fi"] },
  { region: "lenkeran", name: "Mərcan Sahil Restoranı", category: "restaurant", priceLevel: 2, avgPrice: 22, rating: 4.5, reviews: 310, hours: "10:00–23:00", phone: "+994 25 255 16 16", lat: 38.7475, lng: 48.8605, image: IMG.food.grape, address: "Dənizkənarı bulvar", description: "Xəzərin dalğaları kənarında — mərcan balığı, ləvəngi və yerli buğda pizza ilə ailəvi süfrə. Gün batımı üçün masa rezerv etmək lazımdır.", amenities: ["Dəniz mənzərəsi", "Ləvəngi", "Ailəvi"] },
  { region: "lenkeran", name: "Lənkəran Çay Evi", category: "cafe", priceLevel: 1, avgPrice: 5, rating: 4.6, reviews: 450, hours: "07:00–21:00", phone: "+994 25 555 17 17", lat: 38.7525, lng: 48.849, image: IMG.tea.pear, address: "Böyük Bazar yanı", description: "Talış çayı samavarda — yerli çay plantasiyalarının məhsulu, yanında feyxoa mürəbbəsi. Lahmacun yaxınlıqdadır.", amenities: ["Lənkəran çayı", "Feyxoa mürəbbəsi", "Samovar"] },
  { region: "lenkeran", name: "Araz Supermarket Lənkəran", category: "supermarket", priceLevel: 1, avgPrice: 15, rating: 4.1, reviews: 230, hours: "08:00–22:00", phone: "+994 25 555 18 18", lat: 38.7545, lng: 48.8525, image: IMG.market.dairy, address: "Ş. Ə. Axundov küç. 3", description: "Şəhərin əsas supermarketi — limon, çay və feyxoa bölməsi ilə yerli məhsul axtarışı üçün əlverişli.", amenities: ["Yerli sitrus", "Çay bölməsi"] },

  // ---------- Quba ----------
  { region: "quba", name: "Rixos Quba Azerbaijan", category: "hotel", priceLevel: 3, avgPrice: 260, rating: 4.8, reviews: 620, hours: "24 saat", phone: "+994 23 349 49 49", lat: 41.3625, lng: 48.5235, image: IMG.hotel.room2, featured: true, address: "A. Rəfibəyli küç. 1", description: "Şahdağ yolunda hər şey daxil kurort — qulluq, minigolf, uşaq klubu və dağ mənzərəli otaqlar ilə Azərbaycanın seçilən ailəvi hoteli.", amenities: ["All-inclusive", "Uşaq klubu", "Minigolf", "Hovuz"] },
  { region: "quba", name: "Quba Palace Hotel", category: "hotel", priceLevel: 2, avgPrice: 135, rating: 4.5, reviews: 350, hours: "24 saat", phone: "+994 23 349 50 50", lat: 41.3585, lng: 48.5095, image: IMG.hotel.room1, address: "Quba–Şahdağ yolu 3-cü km", description: "Golf meydançası ilə məşhur kurort — sakit bağlar, SPA və Xınalıq turlarının təşkili.", amenities: ["Golf", "SPA", "Bağ", "Tur xidməti"] },
  { region: "quba", name: "Xınalıq Evi Restoranı", category: "restaurant", priceLevel: 1, avgPrice: 18, rating: 4.6, reviews: 290, hours: "10:00–21:00", phone: "+994 23 555 60 61", lat: 41.3615, lng: 48.5145, image: IMG.food.dolma1, address: "M. T. Süleymanov küç. 9", description: "Xınalıq mədəniyyətinin kulinariya təmsilçisi — dağ qoyunu kababı, ikiqat bişirilmiş kartof və kətə ilə tanınan kiçik ailə restoranı.", amenities: ["Dağ mətbəxi", "Ailəvi", "Kabab"] },
  { region: "quba", name: "Quba Alma Bağı Kafesi", category: "cafe", priceLevel: 1, avgPrice: 7, rating: 4.4, reviews: 180, hours: "09:00–20:00", phone: "+994 55 555 62 62", lat: 41.364, lng: 48.5165, image: IMG.tea.pear, address: "Heydər parkı girişi", description: "Alma baqlarının arasında kiçik kafe — təzə alma suyu, almalı piroq və yay sərini.", amenities: ["Alma suyu", "Park", "Açıq hava"] },

  // ---------- Xızı ----------
  { region: "khizi", name: "Altıağac Turizm Bazası", category: "hotel", priceLevel: 1, avgPrice: 45, rating: 4.2, reviews: 110, hours: "24 saat", phone: "+994 23 555 70 71", lat: 40.9185, lng: 48.8905, image: IMG.hotel.room6, address: "Altıağac kəndi, milli park yolu", description: "Dağ meşəsinin kənarında sadə turizm bazası — otaqlar isti, səhər yeməyi ev tipinə və Candy Cane dağlarına yol təxminən 30 dəqiqədir.", amenities: ["Dağ mövqeyi", "Ev yeməyi", "Eko-turizm"] },
  { region: "khizi", name: "Giləzi Çay Evi", category: "cafe", priceLevel: 1, avgPrice: 6, rating: 4.3, reviews: 90, hours: "07:00–21:00", phone: "+994 23 555 72 72", lat: 40.9115, lng: 49.0715, image: IMG.tea.rustic, address: "Bakı–Quba yolu, Giləzi", description: "Yol üstü əfsanəvi çayxana — sürücülərin dayanacağı, dəm çay və ev murabbələri ilə tanınır. Qatıqlı südlü çay spesialitetidir.", amenities: ["Yol üstü", "Mürəbbə", "Səmərəli"] },
  { region: "khizi", name: "Neptun Market Xızı", category: "supermarket", priceLevel: 1, avgPrice: 14, rating: 4.0, reviews: 130, hours: "08:00–21:00", phone: "+994 23 555 73 73", lat: 40.9095, lng: 49.0745, image: IMG.market.aisle1, address: "Xızı şəhəri, mərkəz", description: "Rayonun əsas marketi — yol üçün su və qəlyanaltı standartları, həmçinin yerli bal kartelləri.", amenities: ["Yol ehtiyatı", "Yerli bal"] },

  // ---------- Şamaxı ----------
  { region: "shamakhi", name: "Şamaxı Palace Hotel", category: "hotel", priceLevel: 3, avgPrice: 150, rating: 4.6, reviews: 280, hours: "24 saat", phone: "+994 26 255 80 80", lat: 40.6325, lng: 48.6395, image: IMG.hotel.room5, address: "Şamaxı–Şirvan yolu 2-ci km", description: "Şirvan üzüm bağlarının ortasında butik kurort — şərab degustasiya zalı, atlı tur və hovuz ilə təcrid olunmuş rahatlama.", amenities: ["Şərab zalı", "At turları", "Hovuz"] },
  { region: "shamakhi", name: "Şirvan Restoranı", category: "restaurant", priceLevel: 2, avgPrice: 20, rating: 4.4, reviews: 210, hours: "10:00–22:00", phone: "+994 26 255 81 81", lat: 40.6305, lng: 48.6405, image: IMG.food.meze, address: "S. Vurğun küç. 14", description: "Şamaxı mətbəxinin klassikaları — Şamaxı qovuğu qızartması, toyuq təngacı və yerli pendirli kətə.", amenities: ["Yerli spesialitetlər", "Ailəvi"] },
  { region: "shamakhi", name: "Araz Supermarket Şamaxı", category: "supermarket", priceLevel: 1, avgPrice: 15, rating: 4.1, reviews: 150, hours: "08:00–21:00", phone: "+994 26 255 82 82", lat: 40.6315, lng: 48.6422, image: IMG.market.aisle2, address: "20 Yanvar küç. 6", description: "Mərkəzdə rahat dayanacaq — Meysari şərabları rəfi və qəlyanaltı dəstləri ilə səyahət ehtiyatları.", amenities: ["Şərab rəfi", "Mərkəzdə"] },

  // ---------- İsmayıllı ----------
  { region: "ismayilli", name: "Lahıc Kənd Evi Oteli", category: "hotel", priceLevel: 1, avgPrice: 52, rating: 4.4, reviews: 140, hours: "24 saat", phone: "+994 20 555 90 91", lat: 40.8495, lng: 48.3835, image: IMG.hotel.room4, address: "Lahıc kəndi, yuxarı hissə", description: "Daş divarlı üç yüzillik evdə qonaq evi — mis ocaqda hazırlanmış səhər yeməyi və Girdman vadisinə baxan kiçik eyvan.", amenities: ["Tarixi ev", "Ev yeməyi", "Vadi mənzərəsi"] },
  { region: "ismayilli", name: "Lahıc Çinar Restoranı", category: "restaurant", priceLevel: 1, avgPrice: 14, rating: 4.5, reviews: 160, hours: "10:00–20:00", phone: "+994 20 555 92 92", lat: 40.8485, lng: 48.3822, image: IMG.food.dolma2, address: "Lahıc kəndi, bulaq yanı", description: "Çinar altında dağ süfrəsi — xaş, dağ qoyunu və yerli kartof sahəsi ilə yorğun gəzinti sonrası ideal.", amenities: ["Göl yanı", "Xaş", "Dağ havası"] },
  { region: "ismayilli", name: "Basqal Kelağayı İpək Evi", category: "store", priceLevel: 2, avgPrice: 35, rating: 4.7, reviews: 190, hours: "09:00–18:00", phone: "+994 20 555 93 93", lat: 40.7615, lng: 48.4025, image: IMG.baku.bazaar1, address: "Basqal kəndi, toxucu evi", description: "UNESCO irs siyahısındakı kelağayı eşarpları — birbaşa toxuculardan alış, qiymətlər emalatxanadan və hər zər rəngin hekayəsi ilə.", amenities: ["UNESCO irsi", "Əl işi", "Suvenir"] },
];

// idempotent seed: clear and re-insert
async function main() {
  console.log("Köhnə məlumatlar silinir...");
  await db.delete(savedItineraries);
  await db.delete(submissions);
  await db.delete(venues);
  await db.delete(attractions);
  await db.delete(regions);

  console.log("Regionlar əlavə olunur...");
  await db.insert(regions).values(
    REGIONS.map((r) => ({
      slug: r.slug,
      name: r.name,
      tagline: r.tagline,
      description: r.description,
      history: r.history,
      culture: r.culture,
      tips: r.tips,
      image: r.image,
      lat: r.lat,
      lng: r.lng,
      distanceFromBaku: r.distanceFromBaku,
      featured: r.featured,
    })),
  );

  const regionRows = await db.select().from(regions);
  const slugToId = new Map(regionRows.map((r) => [r.slug, r.id]));

  console.log("Görməli yerlər əlavə olunur...");
  await db.insert(attractions).values(
    ATTRACTIONS.map((a) => ({
      regionId: slugToId.get(a.region)!,
      name: a.name,
      type: a.type,
      description: a.description,
      image: a.image,
      ticket: a.ticket,
      rating: a.rating,
      lat: a.lat,
      lng: a.lng,
    })),
  );

  console.log("Məkanlar əlavə olunur...");
  await db.insert(venues).values(
    VENUES.map((v) => ({
      regionId: slugToId.get(v.region)!,
      name: v.name,
      category: v.category,
      description: v.description,
      address: v.address,
      priceLevel: v.priceLevel,
      avgPrice: v.avgPrice,
      rating: v.rating,
      reviews: v.reviews,
      hours: v.hours,
      phone: v.phone,
      image: v.image,
      lat: v.lat,
      lng: v.lng,
      featured: v.featured ?? false,
      status: "approved",
      amenities: v.amenities,
    })),
  );

  console.log("Hazırdır ✔", {
    regions: REGIONS.length,
    attractions: ATTRACTIONS.length,
    venues: VENUES.length,
  });
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
