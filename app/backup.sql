--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4 (Ubuntu 16.4-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: default
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "default";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: default
--

COMMENT ON SCHEMA public IS '';


--
-- Name: update_gear_avg_rating(); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.update_gear_avg_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE "Gear"
    SET "avgRating" = COALESCE((
      SELECT AVG(rating)
      FROM "Review"
      WHERE "gearId" = OLD."gearId"
    ), 0),
    "reviewCount" = (
      SELECT COUNT(*)
      FROM "Review"
      WHERE "gearId" = OLD."gearId"
    )
    WHERE id = OLD."gearId";
  ELSE
    UPDATE "Gear"
    SET "avgRating" = COALESCE((
      SELECT AVG(rating)
      FROM "Review"
      WHERE "gearId" = NEW."gearId"
    ), 0),
    "reviewCount" = (
      SELECT COUNT(*)
      FROM "Review"
      WHERE "gearId" = NEW."gearId"
    )
    WHERE id = NEW."gearId";
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_gear_avg_rating() OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO "default";

--
-- Name: Brand; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Brand" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Brand" OWNER TO "default";

--
-- Name: Brand_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."Brand_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Brand_id_seq" OWNER TO "default";

--
-- Name: Brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."Brand_id_seq" OWNED BY public."Brand".id;


--
-- Name: CacheEntry; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."CacheEntry" (
    key text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CacheEntry" OWNER TO "default";

--
-- Name: Category; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO "default";

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO "default";

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Gear; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Gear" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    img text NOT NULL,
    price integer,
    "productUrl" text,
    weight integer NOT NULL,
    "brandId" integer NOT NULL,
    "categoryId" integer NOT NULL,
    "avgRating" double precision DEFAULT 0,
    "reviewCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Gear" OWNER TO "default";

--
-- Name: Gear_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."Gear_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Gear_id_seq" OWNER TO "default";

--
-- Name: Gear_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."Gear_id_seq" OWNED BY public."Gear".id;


--
-- Name: PackingList; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."PackingList" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "gearId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text DEFAULT ''::text NOT NULL,
    "tripId" integer,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PackingList" OWNER TO "default";

--
-- Name: PackingListItem; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."PackingListItem" (
    id integer NOT NULL,
    "packingListId" integer NOT NULL,
    "gearId" integer,
    "personalGearId" integer,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."PackingListItem" OWNER TO "default";

--
-- Name: PackingListItem_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."PackingListItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PackingListItem_id_seq" OWNER TO "default";

--
-- Name: PackingListItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."PackingListItem_id_seq" OWNED BY public."PackingListItem".id;


--
-- Name: PackingListLike; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."PackingListLike" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "packingListId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PackingListLike" OWNER TO "default";

--
-- Name: PackingListLike_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."PackingListLike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PackingListLike_id_seq" OWNER TO "default";

--
-- Name: PackingListLike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."PackingListLike_id_seq" OWNED BY public."PackingListLike".id;


--
-- Name: PackingList_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."PackingList_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PackingList_id_seq" OWNER TO "default";

--
-- Name: PackingList_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."PackingList_id_seq" OWNED BY public."PackingList".id;


--
-- Name: PersonalGear; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."PersonalGear" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    weight integer NOT NULL,
    "categoryId" integer NOT NULL,
    img text,
    price integer,
    "productUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "brandId" integer,
    "gearId" integer
);


ALTER TABLE public."PersonalGear" OWNER TO "default";

--
-- Name: PersonalGear_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."PersonalGear_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PersonalGear_id_seq" OWNER TO "default";

--
-- Name: PersonalGear_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."PersonalGear_id_seq" OWNED BY public."PersonalGear".id;


--
-- Name: Review; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Review" (
    id integer NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    "gearId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Review" OWNER TO "default";

--
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."Review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Review_id_seq" OWNER TO "default";

--
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO "default";

--
-- Name: Trip; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Trip" (
    id integer NOT NULL,
    name text NOT NULL,
    ptid text,
    elevation integer,
    lat double precision,
    lon double precision,
    "userId" text NOT NULL
);


ALTER TABLE public."Trip" OWNER TO "default";

--
-- Name: Trip_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."Trip_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Trip_id_seq" OWNER TO "default";

--
-- Name: Trip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."Trip_id_seq" OWNED BY public."Trip".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    password text,
    image text
);


ALTER TABLE public."User" OWNER TO "default";

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO "default";

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "default";

--
-- Name: Brand id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Brand" ALTER COLUMN id SET DEFAULT nextval('public."Brand_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Gear id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Gear" ALTER COLUMN id SET DEFAULT nextval('public."Gear_id_seq"'::regclass);


--
-- Name: PackingList id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingList" ALTER COLUMN id SET DEFAULT nextval('public."PackingList_id_seq"'::regclass);


--
-- Name: PackingListItem id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListItem" ALTER COLUMN id SET DEFAULT nextval('public."PackingListItem_id_seq"'::regclass);


--
-- Name: PackingListLike id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListLike" ALTER COLUMN id SET DEFAULT nextval('public."PackingListLike_id_seq"'::regclass);


--
-- Name: PersonalGear id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PersonalGear" ALTER COLUMN id SET DEFAULT nextval('public."PersonalGear_id_seq"'::regclass);


--
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- Name: Trip id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Trip" ALTER COLUMN id SET DEFAULT nextval('public."Trip_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
cm0icw08700021colwwn8fix1	cm0icvzm200001colna77gyde	oauth	google	103650276590954215779	\N	ya29.a0AcM612xdnRIgRrvwwcGlTtLQ4xegUCs4rMlShK6VzE-YIIY--emFf9pI7O1oH9k8NFjBuzbMjZCZGAGHUv4Ajp8r0C411cNhSPhpg2lxM17wwygZxSVUj-aVrCbQP1ttRiLwqB7HVMlHp1SwS0TAZ7HVpIVnjZPWngywvwGraCgYKAYYSARASFQHGX2MiTfSFXrJrIohfXYdI3in_cg0175	1725125245	Bearer	https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid	eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZjgwYzYzNDYwMGVkMTMwNzIxMDFhOGI0MjIwNDQzNDMzZGIyODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMjczMTQ3MTc3NzQtbmFydDhpb2dxNjd1dDY1MjZ1MmRtMDkxMGViZ2Z1Nm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMjczMTQ3MTc3NzQtbmFydDhpb2dxNjd1dDY1MjZ1MmRtMDkxMGViZ2Z1Nm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM2NTAyNzY1OTA5NTQyMTU3NzkiLCJlbWFpbCI6ImZoNmVkcGl6ZkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImxsTUx4ZlFBc3VvY3VLNmVXaFV6Z2ciLCJuYW1lIjoiR2FhIFN1dSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMVHhLemZXbDVpc0E5aENWV1RqU3poMWZuMGUtTnZaZVJlN0RKMDdjYmd5c2I2Nmc9czk2LWMiLCJnaXZlbl9uYW1lIjoiR2FhIiwiZmFtaWx5X25hbWUiOiJTdXUiLCJpYXQiOjE3MjUxMjE2NDYsImV4cCI6MTcyNTEyNTI0Nn0.t1WyNwCMa0q-EQU2WhLeJGq9XsTgTIxw1grrsFi-MvQKJkxRB8iSwneRd_Ae0aY74mar_IyhbDXtbTKu0dJK5icKcGSVsjxkbZ4hRpgXYMPYihiKrBENT4_C_IrOixfXDMMiOzMlOA1QA7VS1iey7CC9UkiBmdOTS0jcgg3uOzqMBNuw3_LEWEbCD6xKb2Uhk8xyFcbF9wBBmlJ_Jeaabj3Iix1UyODR0WKbRCSEUtYbmm7AJQmHIGs-J1M7PqTqXoTerfU3M6JrsyDCBMnoIIAOnucMIwBlFmk8OUcSjCy8gBCquF0_ZpIF8SP1G6g_JnLf1E51TMvE6ST7qulLVg	\N
cm0mmn5ve0002tqtsez52d627	cm0mmn51f0000tqtshufqtmu8	oauth	google	108736122500531274353	\N	ya29.a0AcM612y6yviZczx6f9x98zrF6SGvf_wUKECEXSUblQzgBX4fuXlxWww3W-X4rVjAm2smvN81wXT5ObnfYYXJT8_dE9J1EXQvnWFCl3Y7ahgUMp0iwKtNTAdpb3sH00M_iJyjpzvsMqg_rhuKwnx4GHjWMoV9PDADXKKlqEoJaCgYKAfUSARMSFQHGX2MiOxMJceSRfjedVRUxx2C1sw0175	1725383492	Bearer	openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile	eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZjgwYzYzNDYwMGVkMTMwNzIxMDFhOGI0MjIwNDQzNDMzZGIyODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMjczMTQ3MTc3NzQtbmFydDhpb2dxNjd1dDY1MjZ1MmRtMDkxMGViZ2Z1Nm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMjczMTQ3MTc3NzQtbmFydDhpb2dxNjd1dDY1MjZ1MmRtMDkxMGViZ2Z1Nm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg3MzYxMjI1MDA1MzEyNzQzNTMiLCJlbWFpbCI6InJhYmJpdGZpZ2h0ZXIub2thbm9AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJoUTVkZFhRYzJyQm5jWXA3TWxoYmFnIiwibmFtZSI6IuWyoemHjuaLk-a1tyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLYi1nSGJ6Q3ZUb2ZibHo0MTZGMFVJTF9raGFIYUQ0RlMtRHhrMUdwcXo3d0lpLUE9czk2LWMiLCJnaXZlbl9uYW1lIjoi5ouT5rW3IiwiZmFtaWx5X25hbWUiOiLlsqHph44iLCJpYXQiOjE3MjUzNzk4OTMsImV4cCI6MTcyNTM4MzQ5M30.HRk7yyMJpKIgpT7Fe3F3F6Mw3wuR_HVdAHfaHBspuj61jpcJpzZLiKgjbyaM5y_xqK7vaKKD5P5c9HWgRdNLlRDuVlKcjQMRkKx05tf6JPjd57qBOZuwTMxbe5-SMDUcYce-beXnL6gPvQeuQ5hF9iWwgiZvEZTlIxd_Pt65_OM-faPL8L0Nw7RRk_CycP7vVaW53qM79U_g_fE3j_3SvnGgMoiLqST1XTo6QfvrcxKCRb05IUQdhA9M9zNUneRLIfnSCa6QUiIyS3px44hstGmqAmNmiUlMzh5UzlwLygey55rHDTXfi98HQ02yKJf1tSR_3poh-8R_5WY6LGvEwQ	\N
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Brand" (id, name) FROM stdin;
1	patagonia
2	MSR
4	JETBOIL
5	HOVERLIGHT
7	trangia
8	Fun Light Gear
10	Astoro Foil
11	JINDAIJI MOUNTAIN WORKS
12	VARGO
14	Trail Bum
15	Highland Designs
16	SHINRYO
17	山と道
18	GSI
19	Cascade Wild
20	WESTERN MOUNTAINEERING
21	Point6
23	TOAKS
24	Therm-a-Rest
25	AKIHIRO WOOD WORKS
26	MIZO
27	CUMULUSCUMULUS
28	factory-b
29	OMMOMM
30	JOLLY GEAR
31	AXESQUIN
32	atelier setsugekka
33	Esbit
34	N. Works
35	LINDEN
36	Evernew
37	Senchi Designs
38	MYOG
39	zpacks
40	Wildo
41	SAWYER
42	KATADYN
43	PETZL
44	PARAPACK
45	ONC MERINO
46	迷迭香 マンネンロウ
47	OMM
48	SOL
49	ANKER
22	ENLIGHTENED EQUIPMENT
3	HIGH TAIL DESIGNS
6	Mountain Laurel Designs
9	Six Moon Designs
13	HYPERLITE MOUNTAIN GEAR
50	Six Moon DesignsSix Moon Designs
51	GEAR AIDGEAR AID
52	MAC NETTMAC NETT
53	VARGOVARGO
54	MSRMSR
55	HYPERLITE MOUNTAIN GEARHYPERLITE MOUNTAIN GEAR
56	SwissPIranhaSwissPIranha
57	Mountain Laurel DesignsMountain Laurel Designs
58	SULUK 46SULUK 46
59	TOAKSTOAKS
60	ZpacksZpacks
61	LOOP ALIENLOOP ALIEN
62	SOLA TITANIUMGEARSOLA TITANIUMGEAR
63	Senchi DesignsSenchi Designs
64	ENLIGHTENED EQUIPMENTENLIGHTENED EQUIPMENT
65	HOUDINIHOUDINI
66	NORRONANORRONA
67	STATICSTATIC
68	PA'LANTEPA'LANTE
69	AXESQUINAXESQUIN
70	BatchstovezBatchstovez
71	QiwizQiwiz
72	EsbitEsbit
73	TripodTripod
74	MUNIEQMUNIEQ
75	EVERNEWEVERNEW
76	Iwatani PrimusIwatani Primus
77	Fire DragonFire Dragon
78	Epiphany Outdoor GearEpiphany Outdoor Gear
79	UCOUCO
80	EXOTACEXOTAC
81	MOONLIGHTGEARMOONLIGHTGEAR
82	2-tacs
83	Tritensil
84	高山植物図鑑高山植物図鑑
85	HIKER TRASHHIKER TRASH
86	CARRY THE SUN
\.


--
-- Data for Name: CacheEntry; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."CacheEntry" (key, value, "expiresAt") FROM stdin;
gears-undefined-undefined	[{"id":242,"name":"2F-PL/Ti","description":"2F-PL/Ti - 5g","categoryId":4,"brandId":28,"img":"https://hikersdepot.jp/cdn/shop/files/2fpl_ti_3.heic?v=1714292014&width=3024","price":4730,"productUrl":"https://hikersdepot.jp/products/2f-pl-ti","weight":5,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":28,"name":"factory-b"}},{"id":243,"name":"MP500 FLAT","description":"MP500 FLAT - 78g","categoryId":4,"brandId":36,"img":"https://hikersdepot.jp/cdn/shop/products/ev_mp500flat_1.jpg?v=1678529762&width=3024","price":6050,"productUrl":"https://hikersdepot.jp/products/mp500-flat","weight":78,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":36,"name":"Evernew"}},{"id":244,"name":"LEVEL","description":"LEVEL - 88g","categoryId":4,"brandId":28,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_8970.jpg?v=1615433984&width=3024","price":11000,"productUrl":"https://hikersdepot.jp/products/level","weight":88,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":28,"name":"factory-b"}},{"id":245,"name":"Ti SOLO POT Nh","description":"Ti SOLO POT Nh - 64g","categoryId":4,"brandId":36,"img":"https://hikersdepot.jp/cdn/shop/files/ev_tinh_1.jpg?v=1685181593&width=3024","price":6380,"productUrl":"https://hikersdepot.jp/products/ti-solo-pot-nh","weight":64,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":36,"name":"Evernew"}},{"id":246,"name":"HOVERLIGHT SPORK","description":"HOVERLIGHT SPORK - 7g","categoryId":4,"brandId":5,"img":"https://hikersdepot.jp/cdn/shop/products/hvlt_1.jpg?v=1674875444&width=3024","price":3300,"productUrl":"https://hikersdepot.jp/products/hoverlight-spork","weight":7,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":5,"name":"HOVERLIGHT"}},{"id":247,"name":"BLUENOTE stove w/ pre-heating plate","description":"BLUENOTE stove w/ pre-heating plate - 20g","categoryId":4,"brandId":36,"img":"https://hikersdepot.jp/cdn/shop/products/ev_bluenote_7.jpg?v=1645094577&width=3024","price":6930,"productUrl":"https://hikersdepot.jp/products/bluenote-stove-w-pre-heating-plate","weight":20,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":36,"name":"Evernew"}},{"id":248,"name":"Ti POT 750ml NH","description":"Ti POT 750ml NH - 80g","categoryId":4,"brandId":23,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_6706-345x345.jpg?v=1630813607&width=345","price":5170,"productUrl":"https://hikersdepot.jp/products/ti-pot-750ml-nh","weight":80,"reviews":[{"id":3,"rating":3,"comment":"米を炊くのにいい大きさ","gearId":248,"createdAt":"2024-09-01T14:22:43.987Z"}],"category":{"id":4,"name":"クッキング"},"brand":{"id":23,"name":"TOAKS"}},{"id":249,"name":"UltraLight Folding Table","description":"UltraLight Folding Table - 62g","categoryId":4,"brandId":19,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_3105.jpg?v=1615433961&width=3024","price":2090,"productUrl":"https://hikersdepot.jp/products/ultralight-folding-table","weight":62,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":19,"name":"Cascade Wild"}},{"id":250,"name":"高耐熱アルミ付きシリコンフォームシート","description":"高耐熱アルミ付きシリコンフォームシート - 7g","categoryId":4,"brandId":15,"img":"https://hikersdepot.jp/cdn/shop/files/IMG_2724-520x390.jpg?v=1712649031&width=520","price":1430,"productUrl":"https://hikersdepot.jp/products/silicon-foam-sheet","weight":7,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":15,"name":"Highland Designs"}},{"id":251,"name":"Solid Fuel","description":"Solid Fuel - 4g","categoryId":4,"brandId":33,"img":"https://hikersdepot.jp/cdn/shop/products/esbit_4g.jpg?v=1615433922&width=655","price":814,"productUrl":"https://hikersdepot.jp/products/solid-fuel","weight":4,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":33,"name":"Esbit"}},{"id":252,"name":"Measure Cap PP Bottle","description":"Measure Cap PP Bottle - 18g","categoryId":4,"brandId":16,"img":"https://hikersdepot.jp/cdn/shop/products/PP.jpg?v=1636794370&width=3024","price":440,"productUrl":"https://hikersdepot.jp/products/measure-cap-100ml","weight":18,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":16,"name":"SHINRYO"}},{"id":253,"name":"Pot Handle","description":"Pot Handle - 20g","categoryId":4,"brandId":7,"img":"https://hikersdepot.jp/cdn/shop/products/uid000002_20100311173804ae169aa4.jpg?v=1615433906&width=320","price":715,"productUrl":"https://hikersdepot.jp/products/pot-handle","weight":20,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":7,"name":"trangia"}},{"id":254,"name":"チタンスモールスプーン","description":"チタンスモールスプーン - 10g","categoryId":4,"brandId":26,"img":"https://hikersdepot.jp/cdn/shop/products/mizo_ti_s_spoonjpg.jpg?v=1615433897&width=379","price":660,"productUrl":"https://hikersdepot.jp/products/titan-smallspoon","weight":10,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":26,"name":"MIZO"}},{"id":255,"name":"Stash","description":"Stash - 203g","categoryId":4,"brandId":4,"img":"https://hikersdepot.jp/cdn/shop/products/stash_1.jpg?v=1615427289&width=536","price":19800,"productUrl":"https://hikersdepot.jp/products/stash","weight":203,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":4,"name":"JETBOIL"}},{"id":256,"name":"JETPOWER100G","description":"JETPOWER100G - 194g","categoryId":4,"brandId":4,"img":"https://hikersdepot.jp/cdn/shop/files/IMG_2545-520x520.jpg?v=1712223374&width=520","price":605,"productUrl":"https://hikersdepot.jp/products/jetpower100g","weight":194,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":4,"name":"JETBOIL"}},{"id":257,"name":"Windburner","description":"Windburner - 465g","categoryId":4,"brandId":2,"img":"https://hikersdepot.jp/cdn/shop/files/IMG_9311-768x768.jpg?v=1712646563&width=768","price":31900,"productUrl":"https://hikersdepot.jp/products/windburner","weight":465,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":2,"name":"MSR"}},{"id":258,"name":"Ti POT 550ml NH","description":"Ti POT 550ml NH - 57g","categoryId":4,"brandId":23,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_6702-345x345.jpg?v=1630813356&width=345","price":6600,"productUrl":"https://hikersdepot.jp/products/ti-pot-550ml-nh","weight":57,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":23,"name":"TOAKS"}},{"id":259,"name":"ISOPRO110","description":"ISOPRO110 - 210g","categoryId":4,"brandId":2,"img":"https://hikersdepot.jp/cdn/shop/files/IMG_9307-520x520.jpg?v=1712218786&width=520","price":770,"productUrl":"https://hikersdepot.jp/products/isopro110","weight":210,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":2,"name":"MSR"}},{"id":260,"name":"GEL BURNER","description":"GEL BURNER - 17g","categoryId":4,"brandId":7,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_7032.jpg?v=1615427249&width=2448","price":1045,"productUrl":"https://hikersdepot.jp/products/gel-burner","weight":17,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":7,"name":"trangia"}},{"id":261,"name":"除菌もできる燃料用アルコール","description":"除菌もできる燃料用アルコール - 400g","categoryId":4,"brandId":35,"img":"https://hikersdepot.jp/cdn/shop/products/LINDEN1.jpg?v=1622017193&width=2448","price":1320,"productUrl":"https://hikersdepot.jp/products/jyokinalcohol","weight":400,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":35,"name":"LINDEN"}}]	2024-09-02 14:29:48.167
gears-undefined-クッキング	[{"id":242,"name":"2F-PL/Ti","description":"2F-PL/Ti - 5g","categoryId":4,"brandId":28,"img":"https://hikersdepot.jp/cdn/shop/files/2fpl_ti_3.heic?v=1714292014&width=3024","price":4730,"productUrl":"https://hikersdepot.jp/products/2f-pl-ti","weight":5,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":28,"name":"factory-b"}},{"id":243,"name":"MP500 FLAT","description":"MP500 FLAT - 78g","categoryId":4,"brandId":36,"img":"https://hikersdepot.jp/cdn/shop/products/ev_mp500flat_1.jpg?v=1678529762&width=3024","price":6050,"productUrl":"https://hikersdepot.jp/products/mp500-flat","weight":78,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":36,"name":"Evernew"}},{"id":244,"name":"LEVEL","description":"LEVEL - 88g","categoryId":4,"brandId":28,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_8970.jpg?v=1615433984&width=3024","price":11000,"productUrl":"https://hikersdepot.jp/products/level","weight":88,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":28,"name":"factory-b"}},{"id":245,"name":"Ti SOLO POT Nh","description":"Ti SOLO POT Nh - 64g","categoryId":4,"brandId":36,"img":"https://hikersdepot.jp/cdn/shop/files/ev_tinh_1.jpg?v=1685181593&width=3024","price":6380,"productUrl":"https://hikersdepot.jp/products/ti-solo-pot-nh","weight":64,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":36,"name":"Evernew"}},{"id":246,"name":"HOVERLIGHT SPORK","description":"HOVERLIGHT SPORK - 7g","categoryId":4,"brandId":5,"img":"https://hikersdepot.jp/cdn/shop/products/hvlt_1.jpg?v=1674875444&width=3024","price":3300,"productUrl":"https://hikersdepot.jp/products/hoverlight-spork","weight":7,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":5,"name":"HOVERLIGHT"}},{"id":247,"name":"BLUENOTE stove w/ pre-heating plate","description":"BLUENOTE stove w/ pre-heating plate - 20g","categoryId":4,"brandId":36,"img":"https://hikersdepot.jp/cdn/shop/products/ev_bluenote_7.jpg?v=1645094577&width=3024","price":6930,"productUrl":"https://hikersdepot.jp/products/bluenote-stove-w-pre-heating-plate","weight":20,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":36,"name":"Evernew"}},{"id":248,"name":"Ti POT 750ml NH","description":"Ti POT 750ml NH - 80g","categoryId":4,"brandId":23,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_6706-345x345.jpg?v=1630813607&width=345","price":5170,"productUrl":"https://hikersdepot.jp/products/ti-pot-750ml-nh","weight":80,"reviews":[{"id":3,"rating":3,"comment":"米を炊くのにいい大きさ","gearId":248,"createdAt":"2024-09-01T14:22:43.987Z"}],"category":{"id":4,"name":"クッキング"},"brand":{"id":23,"name":"TOAKS"}},{"id":249,"name":"UltraLight Folding Table","description":"UltraLight Folding Table - 62g","categoryId":4,"brandId":19,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_3105.jpg?v=1615433961&width=3024","price":2090,"productUrl":"https://hikersdepot.jp/products/ultralight-folding-table","weight":62,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":19,"name":"Cascade Wild"}},{"id":250,"name":"高耐熱アルミ付きシリコンフォームシート","description":"高耐熱アルミ付きシリコンフォームシート - 7g","categoryId":4,"brandId":15,"img":"https://hikersdepot.jp/cdn/shop/files/IMG_2724-520x390.jpg?v=1712649031&width=520","price":1430,"productUrl":"https://hikersdepot.jp/products/silicon-foam-sheet","weight":7,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":15,"name":"Highland Designs"}},{"id":251,"name":"Solid Fuel","description":"Solid Fuel - 4g","categoryId":4,"brandId":33,"img":"https://hikersdepot.jp/cdn/shop/products/esbit_4g.jpg?v=1615433922&width=655","price":814,"productUrl":"https://hikersdepot.jp/products/solid-fuel","weight":4,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":33,"name":"Esbit"}},{"id":252,"name":"Measure Cap PP Bottle","description":"Measure Cap PP Bottle - 18g","categoryId":4,"brandId":16,"img":"https://hikersdepot.jp/cdn/shop/products/PP.jpg?v=1636794370&width=3024","price":440,"productUrl":"https://hikersdepot.jp/products/measure-cap-100ml","weight":18,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":16,"name":"SHINRYO"}},{"id":253,"name":"Pot Handle","description":"Pot Handle - 20g","categoryId":4,"brandId":7,"img":"https://hikersdepot.jp/cdn/shop/products/uid000002_20100311173804ae169aa4.jpg?v=1615433906&width=320","price":715,"productUrl":"https://hikersdepot.jp/products/pot-handle","weight":20,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":7,"name":"trangia"}},{"id":254,"name":"チタンスモールスプーン","description":"チタンスモールスプーン - 10g","categoryId":4,"brandId":26,"img":"https://hikersdepot.jp/cdn/shop/products/mizo_ti_s_spoonjpg.jpg?v=1615433897&width=379","price":660,"productUrl":"https://hikersdepot.jp/products/titan-smallspoon","weight":10,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":26,"name":"MIZO"}},{"id":255,"name":"Stash","description":"Stash - 203g","categoryId":4,"brandId":4,"img":"https://hikersdepot.jp/cdn/shop/products/stash_1.jpg?v=1615427289&width=536","price":19800,"productUrl":"https://hikersdepot.jp/products/stash","weight":203,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":4,"name":"JETBOIL"}},{"id":256,"name":"JETPOWER100G","description":"JETPOWER100G - 194g","categoryId":4,"brandId":4,"img":"https://hikersdepot.jp/cdn/shop/files/IMG_2545-520x520.jpg?v=1712223374&width=520","price":605,"productUrl":"https://hikersdepot.jp/products/jetpower100g","weight":194,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":4,"name":"JETBOIL"}},{"id":257,"name":"Windburner","description":"Windburner - 465g","categoryId":4,"brandId":2,"img":"https://hikersdepot.jp/cdn/shop/files/IMG_9311-768x768.jpg?v=1712646563&width=768","price":31900,"productUrl":"https://hikersdepot.jp/products/windburner","weight":465,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":2,"name":"MSR"}},{"id":258,"name":"Ti POT 550ml NH","description":"Ti POT 550ml NH - 57g","categoryId":4,"brandId":23,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_6702-345x345.jpg?v=1630813356&width=345","price":6600,"productUrl":"https://hikersdepot.jp/products/ti-pot-550ml-nh","weight":57,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":23,"name":"TOAKS"}},{"id":259,"name":"ISOPRO110","description":"ISOPRO110 - 210g","categoryId":4,"brandId":2,"img":"https://hikersdepot.jp/cdn/shop/files/IMG_9307-520x520.jpg?v=1712218786&width=520","price":770,"productUrl":"https://hikersdepot.jp/products/isopro110","weight":210,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":2,"name":"MSR"}},{"id":260,"name":"GEL BURNER","description":"GEL BURNER - 17g","categoryId":4,"brandId":7,"img":"https://hikersdepot.jp/cdn/shop/products/IMG_7032.jpg?v=1615427249&width=2448","price":1045,"productUrl":"https://hikersdepot.jp/products/gel-burner","weight":17,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":7,"name":"trangia"}},{"id":261,"name":"除菌もできる燃料用アルコール","description":"除菌もできる燃料用アルコール - 400g","categoryId":4,"brandId":35,"img":"https://hikersdepot.jp/cdn/shop/products/LINDEN1.jpg?v=1622017193&width=2448","price":1320,"productUrl":"https://hikersdepot.jp/products/jyokinalcohol","weight":400,"reviews":[],"category":{"id":4,"name":"クッキング"},"brand":{"id":35,"name":"LINDEN"}}]	2024-09-02 14:30:02.734
gears-six-undefined	[{"id":330,"name":"Six Moon Designs  Deschutes Tarp Set /  シックスムーンデザインズ ディシュッツタープセット","description":"Deschutes Tarp\\n \\n\\n\\n\\n定員\\n１人\\n\\n\\n\\n重量\\n368g \\n\\n\\n\\nサイズ\\n※下記イラスト参照\\n 収納サイズ : 30cm x 11cm\\n\\n\\n\\n素材\\nフライ : 20D Silicon Nylon\\n ジッパー ： #3 YKK\\n\\n\\n\\nセット内容\\nタープ、スタッフサック、ガイライン\\n\\n\\n\\nカラー\\n■Gray\\n\\n■Green\\n\\n\\n\\n備考\\n縫製部分のシームリングは（防水加工）されていません。\\n 気になる方はユーザー自身でのメンテナンスをお願いします。\\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\nSerenity Net Tent\\n \\n\\n\\n\\n定員\\n１人\\n\\n\\n\\n重量\\n312g\\n\\n\\n\\nサイズ\\n※上記イラスト参照\\n 収納サイズ : 30cm x 11cm\\n\\n\\n\\n\\n\\n\\n素材\\nメッシュ : Ultralight No-See-Um\\n 底面 : 30D Silicon Nylon\\n ジッパー ： #3 YKK\\n\\n\\n\\nセット内容\\nテント本体、スタッフサック、ガイライン\\n\\n\\n\\n備考\\n縫製部分のシームリングは（防水加工）されていません。\\n 気になる方はユーザー自身でのメンテナンスをお願いします。\\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。","categoryId":2,"brandId":9,"img":"https://moonlight-gear.com/cdn/shop/files/sn_79428f18-fa6c-4097-b0cf-93c4d01ef5b7_large.jpg?v=1683583274","price":81400,"productUrl":"https://moonlight-gear.com/collections/topcat-tenttarp/products/254481944","weight":368,"reviews":[{"id":2,"rating":4,"comment":"とても軽く、初心者にもお勧めできるいいギアだと思います。\\n去年からで北アルにいきましたが、快適に過ごせました。","gearId":330,"createdAt":"2024-09-01T02:05:15.609Z"}],"category":{"id":2,"name":"テント"},"brand":{"id":9,"name":"Six Moon DesignsSix Moon Designs"}},{"id":336,"name":"Six Moon Designs  Owyhee Tarp /  シックスムーンデザインズ オワイヒータープ","description":"定員\\n2人 \\n\\n\\n\\n\\nサイズ\\n※下記イラスト参照\\n\\n\\n\\n\\n\\n重量\\nタープ : 689g\\n バスタブフロア : 213g\\n ギアロフト : 16 g\\n クローズライン : 9g\\n トータル : 938g\\n\\n\\n\\n素材\\nタープ : 30D Silicone Coated Nylon\\n ジッパー : #3 YKK\\n メッシュ : 20D No-See-Um\\n\\n\\n\\nカラー\\n■Gray\\n\\n\\n\\n\\n\\n備考\\n縫製部分のシームリングは (防水加工) されていません。\\n 気になる方はユーザー自身でのメンテナンスをお願いします。\\n なお、シームをする場合はSix Moon DesignsではMcMETT社のSIL NETを推奨しています。","categoryId":2,"brandId":9,"img":"https://moonlight-gear.com/cdn/shop/files/ss_large.jpg?v=1646816817","price":75900,"productUrl":"https://moonlight-gear.com/collections/topcat-tenttarp/products/254481938","weight":689,"reviews":[],"category":{"id":2,"name":"テント"},"brand":{"id":9,"name":"Six Moon DesignsSix Moon Designs"}},{"id":342,"name":"Six Moon Designs  Haven Tarp Set /  シックスムーンデザインズ ヘイブンタープセット","description":"Haven Tarp\\n \\n\\n\\n\\n定員\\n2人\\n\\n\\n\\n重量\\n453g\\n\\n\\n\\nサイズ\\n※下記イラスト参照\\n 収納サイズ : 28cm × 11cm\\n\\n\\n\\n素材\\nフライ：20D Silicon Nylon\\n ジッパー ： #3 YKK\\n\\n\\n\\nセット内容\\nタープ本体、スタッフサック、ガイライン\\n\\n\\n\\nカラー\\n■Gray\\n\\n■Green\\n\\n\\n\\n備考\\n※設営には可変式のトレッキングポール Six Moon Designs純正のテントポールをお使いください。\\n 縫製部分のシームリングは（防水加工）されていません。\\n 気になる方はユーザー自身でのメンテナンスをお願いします。\\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\nHaven Net Tent\\n \\n\\n\\n\\n定員\\n2人\\n\\n\\n\\n重量\\n510g\\n\\n\\n\\nサイズ\\n※上記イラスト参照\\n 収納サイズ : 30cm × 11cm\\n\\n\\n\\n\\n\\n\\n素材\\nメッシュ : Ultralight No-See-Um\\n 底面 : 30D Silicon Nylon\\n ジッパー ： #3 YKK\\n\\n\\n\\nセット内容\\nテント本体、スタッフサック、ガイライン\\n\\n\\n\\n備考\\n\\n縫製部分のシームリングは（防水加工）されていません。\\n 気になる方はユーザー自身でのメンテナンスをお願いします。\\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。","categoryId":2,"brandId":9,"img":"https://moonlight-gear.com/cdn/shop/files/sn_ba2fdec1-5388-4356-966d-1d23f5385f53_large.jpg?v=1683591981","price":94600,"productUrl":"https://moonlight-gear.com/collections/topcat-tenttarp/products/254481945","weight":453510,"reviews":[],"category":{"id":2,"name":"テント"},"brand":{"id":9,"name":"Six Moon DesignsSix Moon Designs"}},{"id":364,"name":"Six Moon Designs Skyscape - Trekker / シックスムーンデザインズ スカイスケイプトレッカー","description":"定員\\n1人\\n\\n\\n\\n重量\\n740g\\n\\n\\n\\nサイズ\\n※下記イラスト参照\\n パッキングサイズ : 28cm x 11cm\\n\\n\\n\\n素材\\nCanopy : 20D Silicone Coated Polyester\\n Floor : 40D Silicone Coated Polyester\\n Netting : 20D No-See-Um\\n Zipper : #3 YKK\\n\\n\\n\\n\\n\\nカラー\\n■Green\\n\\n\\n\\n備考\\nスタッフサック、ガイライン付属。\\n 縫製部分のシームリングは (防水加工) されていません。\\n 気になる方はユーザー自身でのメンテナンスをお願いします。\\n なお、シームをする場合はSix Moon DesignsではMcMETT社のSIL NETを推奨しています。","categoryId":2,"brandId":9,"img":"https://moonlight-gear.com/cdn/shop/files/sixmoon_skyscape_trekker_large.jpg?v=1643066277","price":73700,"productUrl":"https://moonlight-gear.com/collections/topcat-tenttarp/products/41571451","weight":740,"reviews":[],"category":{"id":2,"name":"テント"},"brand":{"id":9,"name":"Six Moon DesignsSix Moon Designs"}},{"id":415,"name":"Six Moon Designs Haven Tarp / シックスムーンデザインズ ヘイブンタープ","description":"定員\\n2人\\n\\n\\n\\nサイズ\\n※下記イラスト参照\\n\\n\\n\\n重量\\n500g\\n\\n\\n\\n素材\\nフライ：20D Silicon Nylon\\n ジッパー ： #3 YKK\\n\\n\\n\\n\\nセット内容\\nタープ、スタッフサック、ガイライン\\n\\n\\n\\nカラー\\n■Gray\\n\\n■Green\\n\\n\\n\\n備考\\n1. 設営には可変式のトレッキングポール Six Moon Designs純正のテントポールをお使いください。\\n 2. 縫製部分のシームリングは（防水加工）されていません。\\n 気になる方はユーザー自身でのメンテナンスをお願いします。\\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。","categoryId":2,"brandId":9,"img":"https://moonlight-gear.com/cdn/shop/files/sixmoon_heaven_tarp_large.jpg?v=1653653962","price":60500,"productUrl":"https://moonlight-gear.com/collections/topcat-tenttarp/products/22661373","weight":500,"reviews":[],"category":{"id":2,"name":"テント"},"brand":{"id":9,"name":"Six Moon DesignsSix Moon Designs"}}]	2024-09-02 14:30:46.98
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Category" (id, name) FROM stdin;
3	トップス
4	クッキング
5	バックパック
6	ボトムス
2	テント・タープ
7	トレッキングポール
8	エマージェンシー
9	ランタン・ヘッドライト
10	アクセサリー
11	ボトル・浄水器
12	冬季アイテム
13	傘
14	カトラリー
15	キャップ
16	インサレーション
17	ストーブ・燃料
1	スリーピング
18	シューズ
19	ソックス・アンダーウェア
20	テントアクセサリー
\.


--
-- Data for Name: Gear; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Gear" (id, name, description, img, price, "productUrl", weight, "brandId", "categoryId", "avgRating", "reviewCount") FROM stdin;
330	Six Moon Designs  Deschutes Tarp Set /  シックスムーンデザインズ ディシュッツタープセット	Deschutes Tarp\n \n\n\n\n定員\n１人\n\n\n\n重量\n368g \n\n\n\nサイズ\n※下記イラスト参照\n 収納サイズ : 30cm x 11cm\n\n\n\n素材\nフライ : 20D Silicon Nylon\n ジッパー ： #3 YKK\n\n\n\nセット内容\nタープ、スタッフサック、ガイライン\n\n\n\nカラー\n■Gray\n\n■Green\n\n\n\n備考\n縫製部分のシームリングは（防水加工）されていません。\n 気になる方はユーザー自身でのメンテナンスをお願いします。\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nSerenity Net Tent\n \n\n\n\n定員\n１人\n\n\n\n重量\n312g\n\n\n\nサイズ\n※上記イラスト参照\n 収納サイズ : 30cm x 11cm\n\n\n\n\n\n\n素材\nメッシュ : Ultralight No-See-Um\n 底面 : 30D Silicon Nylon\n ジッパー ： #3 YKK\n\n\n\nセット内容\nテント本体、スタッフサック、ガイライン\n\n\n\n備考\n縫製部分のシームリングは（防水加工）されていません。\n 気になる方はユーザー自身でのメンテナンスをお願いします。\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。	https://moonlight-gear.com/cdn/shop/files/sn_79428f18-fa6c-4097-b0cf-93c4d01ef5b7_large.jpg?v=1683583274	81400	https://moonlight-gear.com/collections/topcat-tenttarp/products/254481944	368	9	2	4.5	2
424	KATADYN BeFree / カタダイン ビーフリー 1.0L	容量: 1.0リットル\n浄水能力: 0.1ミクロンのフィルターで、バクテリアや微生物を除去可能\nフィルター寿命: 約1,000リットルの水を浄水可能\n14 × 6.5 × 26.5㎝\n	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWAvDKs7RRyK3w5z93R4Trvj67XEyShKsVtfASKg8OJw&s	9020	https://store.yamap.com/products/katadyn-befree-1-0l	63	42	11	0	0
344	Hyperlite Mountain Gear 2400 Windrider /  ハイパーライトマウンテンギア 2400 ウィンドライダー	容量\n\n40L\n\n\n重量\n799g\n\n\n背面長サイズ\nS : 38.1cm - 43.18cm\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n素材\nボディ : 50D Dyneema®/Poly Hybrid\n ボトム : Double reinforced 150D Dyneema®/Poly Hybrid\n ポケット : Mesh\n\n\nカラー\n\n□White\n\n\n備考\nフレーム付き	https://moonlight-gear.com/cdn/shop/files/2400windrider_01_large.jpg?v=1643355841	61600	https://moonlight-gear.com/collections/topcat-backpack/products/103308062	799	13	5	4.5	2
342	Six Moon Designs  Haven Tarp Set /  シックスムーンデザインズ ヘイブンタープセット	Haven Tarp\n \n\n\n\n定員\n2人\n\n\n\n重量\n453g\n\n\n\nサイズ\n※下記イラスト参照\n 収納サイズ : 28cm × 11cm\n\n\n\n素材\nフライ：20D Silicon Nylon\n ジッパー ： #3 YKK\n\n\n\nセット内容\nタープ本体、スタッフサック、ガイライン\n\n\n\nカラー\n■Gray\n\n■Green\n\n\n\n備考\n※設営には可変式のトレッキングポール Six Moon Designs純正のテントポールをお使いください。\n 縫製部分のシームリングは（防水加工）されていません。\n 気になる方はユーザー自身でのメンテナンスをお願いします。\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nHaven Net Tent\n \n\n\n\n定員\n2人\n\n\n\n重量\n510g\n\n\n\nサイズ\n※上記イラスト参照\n 収納サイズ : 30cm × 11cm\n\n\n\n\n\n\n素材\nメッシュ : Ultralight No-See-Um\n 底面 : 30D Silicon Nylon\n ジッパー ： #3 YKK\n\n\n\nセット内容\nテント本体、スタッフサック、ガイライン\n\n\n\n備考\n\n縫製部分のシームリングは（防水加工）されていません。\n 気になる方はユーザー自身でのメンテナンスをお願いします。\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。	https://moonlight-gear.com/cdn/shop/files/sn_ba2fdec1-5388-4356-966d-1d23f5385f53_large.jpg?v=1683591981	94600	https://moonlight-gear.com/collections/topcat-tenttarp/products/254481945	963	9	2	0	0
417	PB Tarp 5×8	サイズ:1.5m × 2.4m\n重量:160g⇄170g (5g スタッフサック含む)	https://baseec-img-mng.akamaized.net/images/item/origin/df85e5900ffc8e90c59f16bcef886f0c.jpg?imformat=generic&q=90&im=Resize,width=640,type=normal	16500	\N	170	11	2	5	3
419	Six Moon Designs Gatewood Cape / シックスムーンデザインズ ゲイトウッドケープ	H115cm × W267cm × L168cm \n10D シリコン	https://www.sixmoondesigns.com/cdn/shop/products/GreyAwardsGatewoodCape.jpg?v=1639176930&width=1200	42900	\N	285	9	2	4.666666666666667	3
421	Sub-Nero	容量\n本体 : 17L\nセンターポケット : 8L\n各サイドポケット : 2.5L\n合計 : 30L\nサイズ\n対応背面長 : 46cm-56cm\n→︎背面長の測り方\n重量\n本体 : 247g\nシットパッド : 28g\n合計 : 275g\n素材\n■2.92oz/sqyd Ultra 100\n■3.5 oz/sqyd Ultra 200	https://zpacks.com/cdn/shop/files/zpacks-sub-nero-06_2048x_6722a916-e086-411b-a61f-14c2686f28e6_2048x.jpg?v=1725480865	60501	https://moonlight-gear.com/products/159294924	274	39	5	0	0
423	SAWYER MINI SP128 / ソーヤー ミニ SP128	浄水能力: 0.1ミクロンの中空糸膜フィルターを使用し、バクテリアや微生物を99.99999%除去可能です。これは米国環境保護局の基準を上回る性能です。\n浄水量: 最大で約38万リットルの水を浄水できます。\n接続互換性: 市販のペットボトルやプラティパスなどのソフトパウチに接続可能です。\n付属品: 0.5Lのパウチ、洗浄用の注射器、ストローが付属しています。	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVWdfydeBywst1VAvy-vFAnGW_g8HTfrb_YTFzOto-Aw&s	5500	https://www.amazon.co.jp/SAWYER-%E3%82%BD%E3%83%BC%E3%83%A4%E3%83%BC-%E3%83%9F%E3%83%8B-SP128-%E3%80%90%E6%97%A5%E6%9C%AC%E6%AD%A3%E8%A6%8F%E5%93%81%E3%80%91/dp/B00V7X60X0	60	41	11	0	0
302	Quatro Stove	Quatro Stove - 17g	https://hikersdepot.jp/cdn/shop/products/uid000002_201002052211584fb2096e.jpg?v=1615427175&width=640	4400	https://hikersdepot.jp/products/quatro-stove	17	15	4	0	0
326	Tube Quilt	Tube Quilt - 618g	https://hikersdepot.jp/cdn/shop/products/tubequilt_18-e1524025290811.jpg?v=1712645199&width=3474	46200	https://hikersdepot.jp/products/tube-quilt	618	15	1	0	0
324	Astro Foil E	Astro Foil E - 177g	https://hikersdepot.jp/cdn/shop/products/R0014958.jpg?v=1615264887&width=305	1540	https://hikersdepot.jp/products/astro-foil-e	177	10	1	0	0
301	Hillbilly Pot 550	Hillbilly Pot 550 - 80g	https://hikersdepot.jp/cdn/shop/files/hbp550tp-520x520.jpg?v=1712138429&width=500	6050	https://hikersdepot.jp/products/hillbilly-pot-550	80	11	4	0	0
418	MINI2 M size	25-35L\nSize M 390g\n	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdMB1uTcQPkRTIdTmG-K9Y2w2na2KNrISxJqw0ZOC3n2hQ5efyE6hUAGwhzsrLsShKDjQ&usqp=CAU	33000	\N	390	17	5	0	0
316	NeoAir®︎UBERLITE small	NeoAir®︎UBERLITE small - 178g	https://hikersdepot.jp/cdn/shop/products/1550565458.jpg?v=1712630691&width=800	38500	https://hikersdepot.jp/products/neoair-uberlite-small	178	24	1	4.166666666666667	6
422	Wildo fold a cup (Regular)	Regular : 縦7.2cm × 横9.4cm × 高さ2.9cm	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkPoyXmqHAZFFc7-ptwQq-ngu0g3jFqDuQU_bJZlUAxuXkiVn1_rW3Bcdm&s=10	770	https://moonlight-gear.com/collections/cat-cutlery/products/145794302	24	40	14	5	1
425	PETZL BINDI / ペツル ビンディ	光束：200 ルーメン\n重量：35 g\nビームパターン：ワイド\n電源：680 mAh リチャージャブルバッテリー (内蔵)\n保護性能：IPX4（全天候型）	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROyvMvJWVEdJIWOULPRfKq1g52wYu9PvsTgSnJAq6ZeA&s	7800	https://www.petzl.co.jp/headlamp/bindi/	35	43	9	0	0
469	OMM Core Vest / OMM コアベスト	素材\nPRIMALOFT® ACTIVE 75g\n\n\n\nカラー\n■Blue\n ■Black\n\n■Orange\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n Mサイズ\n （172cm/62kg 中肉中背）ゆったりなジャストフィット\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/OMM-Core-Vest_large.jpg?v=1643243887	14300	https://moonlight-gear.com/collections/cat-topsinsulation/products/155026111	72	29	16	0	0
470	OMM Core Zipped Vest / OMM コアジップドベスト	素材\nPRIMALOFT® ACTIVE 125g\n\n\n\nカラー\n■Grey\n  ■Navy\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n Mサイズ\n （172cm/62kg 中肉中背）ゆったりなジャストフィット\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_2ca839d5-6d2c-4799-adbd-9fde0ea5d00d_large.jpg?v=1701145931	17930	https://moonlight-gear.com/collections/cat-topsinsulation/products/254482059	135	29	16	0	0
471	OMM Core Tee / OMM コアティー	素材\nPRIMALOFT® ACTIVE 75g\n\n\n\nカラー\n■Black\n\n■Dark Red\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）タイトフィット\n Mサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_edd1e257-1b0a-4352-b540-33c555ab2a86_large.jpg?v=1682414102	16500	https://moonlight-gear.com/collections/cat-topsinsulation/products/254481949	87	29	16	0	0
298	Lite Grill	Lite Grill - 62g	https://hikersdepot.jp/cdn/shop/products/litegrill_1.jpg?v=1615427208&width=800	5060	https://hikersdepot.jp/products/lite-grill	62	34	4	0	0
304	Merino Alpine T	Merino Alpine T - 168g	https://hikersdepot.jp/cdn/shop/files/p6_merinoalpine_chac.jpg?v=1685866118&width=3024	12100	https://hikersdepot.jp/products/merino-alpine-t	168	21	3	0	0
426	5-Pocket Pants	タスランナイロン	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKiAAH_nkcgPlT45BK-PG9OaA2NJiGV4RYd2n127tX65xleHE7gBqMo5-y&s=10	17500	https://www.yamatomichi.com/products/5-pocket-pants-m	239	17	6	0	0
427	PARAPACK / パラパック P-キャップ	UPF50+\n素材:ポリエステル60% ナイロン40％	https://shop.moderateweb.com/cdn/shop/files/CWz6gGSwB4vKLcAd7WZvVM49Vif1YreJV2ISgVBL.jpg?v=1711603010	7920	https://www.sora-store.jp/c/002/002P/002P004/PCAP-OG	28	44	15	0	0
429	ONC MERINO ロングスリーブ TEE	100% メリノウール\n日本製	https://onc-merino.com/cdn/shop/files/14-2.jpg?v=1712128781&width=900	16500	https://onc-merino.com/collections/23ss/products/black	250	45	3	0	0
430	NYLON HARVEST TRAINER	表地 ナイロン 100%\n袋地 ポリエステル 100%	https://market.e-begin.jp/cdn/shop/files/240822_0693_750x.jpg?v=1725509253	15400	https://market.e-begin.jp/products/whi_mnr0315o?srsltid=AfmBOoorFHVCiugFLUWacY0z5gP-9EufUFiFyBQOr126hNCQNrtEQ12M	250	46	6	0	0
432	エマージェンシーブランケット	142×213cm	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8wmFOapDAfVCd7YgitTLZB0YMyOWxojzGQ&usqp=CAU	700	https://www.google.com/imgres?imgurl=https%3A%2F%2Fitem-shopping.c.yimg.jp%2Fi%2Fl%2Fpasso_s-05-584&tbnid=cSxtmnW84qyKpM&vet=1&imgrefurl=https%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fpasso%2Fs-05-584.html&docid=Vkg6_Usp83fV6M&w=600&h=600&itg=1&source=sh%2Fx%2Fim%2Fm1%2F3&kgs=5b86cc1393c65b62&shem=abme%2Ctrie	70	48	8	0	0
433	PowerCore 10000	\nサイズ\t約92 x 60 x 22mm\n重さ\t約180g\n入力\t5V=2A\n出力\t5V=2.4A\nバッテリー容量\t10000mAh	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ73lDgA-s2yUtYsxEoJNAkbJyKfLf9X6maBFbxPUpgJ89bZd9NAZZu2c&s=10	2990	https://www.ankerjapan.com/products/a1263?srsltid=AfmBOopie-07Hbg0CBhhpLUa5z3Ry0m-i5ay9bub9B1u-75-82KoK0t0	180	49	10	0	0
303	Better Shorts Equilibrium	Better Shorts Equilibrium - 145g	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFAgmf3PJwdGmBAG0DccGKqmONIqgyh2muGw&s	15400	https://hikersdepot.jp/products/better-shorts-equilibrium	145	14	6	0	0
446	TOAKS Titanium V-shaped Peg / トークス チタニウムV字シェイプペグ	サイズ\nH 165mm\n\n\n\n重量\n11g\n\n\n\n\n\n素材\nTitanium	https://moonlight-gear.com/cdn/shop/files/toaks_Vpeg_large.jpg?v=1642996529	1023	https://moonlight-gear.com/collections/cat-tentacc/products/86714105	11	59	20	0	0
448	SULUK 46 / Atani Titanium Tent Stakes	重量\n5g\n\n\nサイズ\n15.2cm\n\n\n\n素材\nチタン	https://moonlight-gear.com/cdn/shop/files/ss_0fe76800-4273-4dcf-822b-7d1e30e86a20_large.jpg?v=1653698075	1430	https://moonlight-gear.com/collections/cat-tentacc/products/254481779	5	58	20	0	0
452	Hyperlite Mountain Gear VOILE STRAPS / ハイパーライトマウンテンギア ボレーストラップ	サイズ\n■全長 : 30.5cm 最小 : 10.7cm 最大 : 23.7cm\n\n■全長 : 38.1cm 最小 : 14cm 最大 : 31.7cm\n ■全長 : 50.8cm最小 : 13cm 最大 : 43.5cm\n\n\n\n重量\n■52.5g\n\n■58.5g\n ■70.0g\n\n\n\n\n素材\nUV-Resistant Polyurethane, Super-Tough® Nylon\n\n\n\nカラー\n■Orange\n\n■Blue\n ■Black\n\n\n\n\n  備考\n※２本セットでの販売となります。	https://moonlight-gear.com/cdn/shop/files/HMG-ULTAMID-POLE-STRAPS_large.jpg?v=1643355710	3740	https://moonlight-gear.com/collections/cat-tentacc/products/126760382	53	55	20	0	0
454	SOLA TITANIUMGEAR Backpacking Guyline Adapter / ソラチタニウムギア バックパッキングガイラインアダプター	重量\n39g～45g ※自在、ガイライン含む\n\n\n\n素材\nカボロンターポリン\n\n\n\n  付属品\nガイライン : (Φ1.8mm-2.0mm x 2.5m) × 4本\n    自在 : 4個\n\n\n\n  備考\nハンドメイドの製品のためガイラインループの取り付け位置は均等ではありません。\n予めご了承ください。	https://moonlight-gear.com/cdn/shop/files/sola_guyline_adapter_large.jpg?v=1643025124	3300	https://moonlight-gear.com/collections/cat-tentacc/products/150977507	39	62	20	0	0
472	OMM Core Hoodie / OMM コアフーディー	素材\nPRIMALOFT® ACTIVE 75g\n\n\n\nカラー\n■Navy\n\n■Dark Red/■Orange\n ■Black \n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n Mサイズ\n （172cm/62kg 中肉中背）ゆったりフィット\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_bd0e9142-a4dd-4d11-a13b-ab03652d9446_large.jpg?v=1682496978	19800	https://moonlight-gear.com/collections/cat-topsinsulation/products/155025958	115	29	16	0	0
473	OMM Core+ Hoodie / OMM コアプラスフーディ	素材\nPRIMALOFT® ACTIVE 125g\n 64 ％再生素材使用\n\n\n\nカラー\n■Navy/Yellow\n ■Black/Grey\n\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n Mサイズ\n （172cm/62kg 中肉中背）ゆったりフィット\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/OMM-Core_-Hoodie_large.jpg?v=1643242169	22550	https://moonlight-gear.com/collections/cat-topsinsulation/products/1165997866	185	29	16	0	0
474	OMM Core Jacket / OMM コアジャケット	素材\nPRIMALOFT® ACTIVE 125g\n\n\n\nカラー\n■Navy\n\n■Gray\n ■Black\n    \n        ■Dark Green\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）スリムフィット\n Mサイズ\n （172cm/62kg 中肉中背）ゆったりなジャストフィット\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_8ad5728d-f509-4b90-a08d-cf4f6413b5b8_large.jpg?v=1701150637	23650	https://moonlight-gear.com/collections/cat-topsinsulation/products/155026511	195	29	16	0	0
475	OMM Mountain Core Smock / OMM マウンテンコアスモック	素材\nFlexileナイロン／スパンデックス混紡\n  PrimaLoft® Active 125g/㎡\n    中綿はリサイクル素材を64％使用\n  \n\n\nカラー\n■Black\n        ■Dark Red\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n Mサイズ\n （172cm/62kg 中肉中背）ゆったりフィット\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_8ad2af83-57e8-4953-9f07-e3b5df4d2fc7_large.jpg?v=1710242846	38500	https://moonlight-gear.com/collections/cat-topsinsulation/products/254482071	322	29	16	0	0
445	Six Moon Designs 5section Carbon Pole / シックスムーンデザインズ 5セクションカーボンポール	サイズ\n116cm (LUNAR SOLO 以外のテント用)\n \n124cm (LUNAR SOLO 専用)\n収納サイズ : 28cm\n\n\n\n重量\n116cm : 約58g\n  124cm : 約61g\n\n\n\n素材\nカーボンファイバー\n\n\n\n\n備考\nEaston社製 Six Moon Designs 別注モデル	https://moonlight-gear.com/cdn/shop/files/sn_b57d998f-53c3-4113-beea-7aa8eb63a24e_large.jpg?v=1688944984	12100	https://moonlight-gear.com/collections/cat-tentacc/products/254482005	58	50	20	0	0
449	Hyperlite Mountain Gear  DYNEEMA® REPAIR KIT /  ハイパーライトマウンテンギア ダイニーマリペアキット	重量\n5g\n\n\n\n\n\n素材\nDyneema® Composite Fabrics\n\n\n\nカラー\n□White	https://moonlight-gear.com/cdn/shop/files/sn_0b2afe65-213e-4cbe-bcd4-9954a1953632_large.jpg?v=1682064708	3520	https://moonlight-gear.com/collections/cat-tentacc/products/254481940	5	55	20	0	0
451	VARGO Titanium Ascent Tent Stake / バーゴ チタニウムアッセントテントステーク	サイズ\n158mm\n\n\n\n重量\n10g\n\n\n\n素材\nチタン	https://moonlight-gear.com/cdn/shop/files/ss_87bbb822-b178-4a09-8c56-71c2c0632726_large.jpg?v=1660793759	880	https://moonlight-gear.com/collections/cat-tentacc/products/254481830	10	53	20	0	0
478	OMM Barrage Jacket / OMM バレッジジャケット	素材\n生地 : POINT ZERO fabric\n 中綿 : Primaloft Gold® with Cross Core / 80g\n\n\n\nカラー\n■Gray/Black\n\n■Green/Black\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット - タイト気味になります。\n Mサイズ\n （172cm/62kg 中肉中背）ゆったりなジャストフィット - 内側にミッドレイヤーなどを着る場合などはSよりもおすすめです。\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/OMM-Barrage-Jacket_large.jpg?v=1643249182	44000	https://moonlight-gear.com/collections/cat-topsinsulation/products/146591411	375	29	16	0	0
447	Zpacks Double-Hook Apparatus / Zパック ダブルフックアパレイタス	重量\n2g\n\n\n\n備考\nコードは含まれていません。	https://moonlight-gear.com/cdn/shop/files/ss_14b4f2b2-a284-4dc5-bd1b-f33134a2a655_large.jpg?v=1655427182	1980	https://moonlight-gear.com/collections/cat-tentacc/products/254481801	2	60	20	0	0
450	OMM Tent Peg (Aluminium) x2 / OMM テントペグ (アルミニウム) x2	サイズ\n130mm\n\n\n\n重量\n10g\n\n\n\n\n\n素材\nアルマイト加工済みアルミ\n\n\n\nカラー\n■Orange\n\n\n\n\n備考\n・2本入り\n ・ボトルオープナーとしても使用可\n ・OMM Classicパックシリーズと互換性あり\n\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。	https://moonlight-gear.com/cdn/shop/files/ss_b196a97a-1581-401f-861b-d0485b94ecf9_large.jpg?v=1682563175	880	https://moonlight-gear.com/collections/cat-tentacc/products/254481852	10	29	20	0	0
453	LOOP ALIEN RCA STARTER KIT / ループエイリアン RCA スターターキット	サイズ\nチタン：3.3cm × 2cm × 0.23cm\n アルミニウム : 3.3cm × 2.0cm × 0.3cm\n\n\n\n重量\nチタン : 2.8g\n アルミニウム : 2.4g\n\n\n\n\n素材\nチタン 6AL-4V (Grade 5) \n アルミニウム 6061 T6\n\n\n\n\nカラー\n ■Gray （チタン）\n\n■Silver（アルミニウム）\n ■Black（アルミニウム）\n\n■Orange（アルミニウム）\n\n■Green（アルミニウム）\n\n■Blue（アルミニウム）\n\n\n\n備考\nガイライン付属\n (20') 1.75 mm Lash-It Dyneema® コード	https://moonlight-gear.com/cdn/shop/files/LOOP-ALIEN-RCA-STARTER-KIT_large.jpg?v=1643348623	3850	https://moonlight-gear.com/collections/cat-tentacc/products/151164578	3	61	20	0	0
520	2-tacs × Moonlightgear BAA#1 Pocket Tee 軽Edition	 メリノウールナイロン天杢 混率：ウール79%　ナイロン21%	https://moonlight-gear.com/cdn/shop/files/sn1_89f2877d-c926-48da-81c0-63edfe9189c5_large.jpg?v=1719802908	12100	https://moonlight-gear.com/collections/cat-tshirts/products/132052011	116	82	3	0	0
458	ENLIGHTENED EQUIPMENT / Men's Torrid APEX Jacket	サイズ\n身幅(cm)\nウエスト(cm）\nヒップ(cm)\nゆき(cm)\nS\n91-99\n76-84\n89-96\n76-81\nM\n101-109\n87-94\n99-106\n79-84\nL\n111-119\n97-104\n109-117\n81-86\n\n\n\n\n\n重量\nS : 234g\n M : 249g\n\n\n\n素材\n表地：Ultralight nylon \n 中綿：2oz/yd² CLIMASHIELD™\n\n\n\nカラー\n■Black\n\n■Forest\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nMサイズ\n （172cm/62kg 中肉中背）ゆったり目フィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/ENLIGHTENED-EQUIPMENT---Men_s-Torrid-APEX-Jacket_large.jpg?v=1643165042	41800	https://moonlight-gear.com/collections/cat-topsinsulation/products/153805168	249	64	16	0	0
468	AXESQUIN × Moonlightgear  WOOL FLEECE PULLOVER 軽Edition	素材\n本体: ウールフラノ起毛加工\n 部分使い: ウールツイード\n\n\n組成\nウール88%、ナイロン10%、その他2%\n\n\nカラー\n\n■Beige\n\n■Navy/■Black\n\n\n\n\n※サイズ選びの参考として\n\n\nXSサイズ\n\n（157cm/49kg 女性の平均身長）ジャストフィット\n\n\nMサイズ\n（172cm/62kg 中肉中背）ジャストフィット\n\n\nLサイズ\n（172cm/62kg 中肉中背）ゆったり目フィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_20960af9-3d59-43a8-b25d-1160e2ae9add_large.jpg?v=1699953042	23100	https://moonlight-gear.com/collections/cat-topsinsulation/products/155931707	0	69	16	0	0
479	SOLA TITANIUMGEAR Super Heater / ソラチタニウムギア スーパーヒーター	サイズ\n直径 : 8.5cm\n 高さ：2.4cm\n\n\n\n\n重量\n45g\n\n\n\n素材\nStainless、Titanium\n\n\n\n  備考\nガスストーブを消してからも、しばらくはヒーターが熱い状態です。\n  \n 水や雪で冷やす事は避けて下さい(変形や破損の原因となります) 火傷にご注意下さい。\n\n \nテントやシェルター内での使用はとても暖かいですが、一酸化炭素中毒や火事の危険が伴います。ご使用になる場合はくれぐれもご注意の上、自己責任でお願いします。	https://moonlight-gear.com/cdn/shop/files/sola_Superheater_large.jpg?v=1643023909	4180	https://moonlight-gear.com/collections/cat-stove/products/123585488	45	62	17	0	0
476	OMM SuperSonic Smock / OMM スーパーソニックスモック	重量\n340g (Mサイズ)\n\n\n\n素材\n表地 : PointZero\n 裏地 : PRIMALOFT® Next Evolve 75g\n\n\n\n\n\nカラー\n■Blue/■Navy\n ■Black\n\n■Green\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\nMサイズ\n （172cm/62kg 中肉中背）ゆったり目のジャストフィット\n\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/OMM-SuperSonic-Smock_large.jpg?v=1643183873	28600	https://moonlight-gear.com/collections/cat-topsinsulation/products/155025892	185	29	16	0	0
477	OMM Rotor Hood jacket / OMM ローターフードジャケット	重量\n340g (Mサイズ)\n\n\n\n素材\nPointZero – 100% 22gsm\n リップストップナイロン\n ダウンプルーフ\n DWR加工　防風\n PRIMALOFT® ACTIVE 125g\n PRIMALOFT® Cross-Core GOLD 80g\n 64％ & 35％　リサイクルインサレーション\n\n\n\n\n\nカラー\n■Black\n\n\n\n備考\nRotor Pant 、 Rotor Foot Potと組み合わせて、軽量で順応性のあるスリープシステムを実現します。\n\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。 \n\n\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\nMサイズ\n （172cm/62kg 中肉中背）ゆったり目フィット ※ミッドレイヤー等のレイヤーを重ねて着る場合はMサイズがおすすめ\n\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/OMM-Rotor-Hood-jacket_large.jpg?v=1643184907	37400	https://moonlight-gear.com/collections/cat-topsinsulation/products/1170493434	340	29	16	0	0
509	MOONLIGHTGEAR D.D Jacket / ムーンライトギア D.D ジャケット	サイズ\n着丈(cm）\n身幅(cm）\nゆき(cm)\n袖口(cm)\n重量(g)\nS/M\n 75(78)\n 64\n 93\n 9.5\n 195\nL/XL\n 77(80)\n 66\n 95\n 10\n 200\n\n\n\n\n\n\n素材\n3レイヤー/PUラミネート\n 50g/m2\n\n\n\n\n耐水圧\n20000mm\n\n\n\n透湿性\n40000g/m2/24h\n\n\n\n\nカラー\n\n■︎︎True Black\n■Sand Beige\n\n\n\n\n備考\n\n・2024年モデル変更点\n S/M 、 L/XLの2サイズ展開。\n 裾にゴムコードをつけ風や雪の侵入を防ぐようにアップデート。\n\n\n\n\n\n\n※サイズ選びの参考として\n\n\n\n男性女性隔てなく着れるユニバーサルデザイン。\n\n\n\n\n※袖口はゴム上がりの寸法です。\n ※着丈は後中心の寸法です。（かっこ内の寸法はサイドネックポイントから裾）\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn2_34e48eb1-8228-4a8a-ae84-4478ac0aa9a2_large.jpg?v=1724547315	38500	https://moonlight-gear.com/collections/topcat-tops/products/254482049	200	81	3	0	0
510	MOONLIGHTGEAR Root Aloha / ムーンライトギア ルートアロハ	サイズ\n着丈(cm）\n身幅(cm）\n袖丈(cm)\n重量(g)\nS\n69.5\n113\n29.5\n175\nM\n71.5\n119\n30.5\n185\nL\n73.5\n125\n32.5\n195\n\n\n\n\n\n\n素材\n100% Cotton\n\n\n\n\nカラー\n\n□︎︎Bird\n\n■Yosemite\n\n\n\n\n\n※サイズ選びの参考として\n\n\n\n男性女性隔てなく着れるユニバーサルデザイン。\n\n\n\n※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn2_03089c06-6afe-4e4d-88ce-d9f369415093_large.jpg?v=1691407160	23100	https://moonlight-gear.com/collections/topcat-tops/products/254482001	185	81	3	0	0
511	HOUDINI Ms Tree Polo Shirt /  フーディニ メンズツリーポロシャツ	サイズ\n前着丈(cm)\n身幅(cm)\nゆき(cm)\nS\n63\n109\n29\nM\n65\n115\n30\nL\n67\n121\n31\n\n\n\n\n\n\n重量\n170g\n\n\n\n素材\nWoodland Weave 100% TENCEL™ Lyocell\n\n\n\nカラー\n   ■True Black Light\n\n  ■Dawn Green■Big Blue Light\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nMサイズ\n （172cm/62kg 中肉中背）ゆったり目フィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_677e3540-2cf6-4722-bf50-4764163f11be_large.jpg?v=1720748132	17600	https://moonlight-gear.com/collections/topcat-tops/products/254481974	170	65	3	0	0
512	HOUDINI M’s Cosmo Shirt /  フーディニ  メンズコスモシャツ	サイズ\n着丈(cm)\n身幅(cm)\n袖口(cm)\n重量(g)\nS\n72\n53\n36\n124\nM\n74\n56\n38\n132\nL\n76\n59\n40\n142\n\n\n\n\n\n\n素材\nWish Woven™ 70% Recycled Polyester, 30% Polyester\n\n\n\nカラー\n\n■Sand Dune\n\n\n\n\n※サイズ選びの参考として\n\n\nMサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nLサイズ\n （172cm/62kg 中肉中背）ゆったり目フィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_5d03f5e3-1b1e-4fd7-bc3f-51b4914e3704_large.jpg?v=1720686186	17600	https://moonlight-gear.com/collections/topcat-tops/products/149262178	132	65	3	0	0
485	Qiwiz / Hinge Pot Support & DualFuel Burner	Hinge Pot Support\n \n\n\nサイズ\n幅7.9cm×高さ5.2cm (折りたたみ時)\n\n\n\n重量\n約8g\n\n\n素材\nステンレススチール、真鍮\n\n\n\nDualFuel Burner\n \n\n\nサイズ\n口径6.2cm×高さ2cm\n\n\n\n重量\n約23g\n\n\n\n素材\nスチール、カーボンフェルト\n\n\n\n備考\n蓋は固形燃料の受け皿としても機能します。	https://moonlight-gear.com/cdn/shop/files/sn_d3f460c6-eecf-4c87-93fd-5e05c5a3be55_large.jpg?v=1713338362	4400	https://moonlight-gear.com/collections/cat-stove/products/254482092	31	71	17	0	0
486	TOAKS Titanium Alcohal Stove / トークス チタニウムアルコールストーブ	Titanium Alcohal Stove\n \n\n\nサイズ\n直径53mm × 高さ40mm\n\n\n\nタンク容量\n80g\n\n\n\n重量\n20g\n\n\n素材\nチタン\n\n\n備考\nナイロンメッシュケース付属\n\n\n\n\nStainless Steel Stove Frame\n \n\n\nサイズ\n高さ78mm × 長さ205mm\n\n\n\n重量\n23g\n\n\n\n素材\nステンレススチール	https://moonlight-gear.com/cdn/shop/files/sn3_large.jpg?v=1682246564	7260	https://moonlight-gear.com/collections/cat-stove/products/254481932	20	59	17	0	0
487	TOAKS Titanium Windscreen / トークス チタニウムウインドスクリーン	サイズ\n580mm × 118mm\n\n\n\n重量\n15g\n\n\n\n\n\n素材\nTitanium	https://moonlight-gear.com/cdn/shop/files/toaks_screen_large.jpg?v=1642996196	2200	https://moonlight-gear.com/collections/cat-stove/products/86718044	15	59	17	0	0
488	Esbit Titanium Stove / エスビット チタニウムストーブ	サイズ\n収納時 : 84mm×29mm\n\n\n\n \n重量\n13g\n\n\n\n  素材\nチタン\n\n\n\n\n  \n備考\nスタッフサック付属	https://moonlight-gear.com/cdn/shop/files/Esbit-Titanium-Stove_73a615f7-f9db-4089-aafb-78193d54a572_large.jpg?v=1643693159	1980	https://moonlight-gear.com/collections/cat-stove/products/45710496	13	72	17	0	0
513	HOUDINI M’s Cover Crew / フーディニ  メンズカバークルー	サイズ\n前着丈(cm)\n身幅(cm)\n裄丈(cm)\nM\n63.5\n54.5\n88\nL\n65\n58\n92\n\n\n\n\n\n\n\n重量\n138g (L)\n\n\n\n素材\nWish Woven™ 70% Recycled Polyester, 30% Polyester\n\n\n\nカラー\n■True Black\n\n■Hay Yellow\n\n\n\n\n\n※サイズ選びの参考として\n\n\n\n\nMサイズ\n （172cm/62kg 中肉中背）ゆったり目フィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_523b5588-3fe4-4fad-90e0-e4f863e8672e_large.jpg?v=1716884972	16500	https://moonlight-gear.com/collections/topcat-tops/products/149257761	138	65	3	0	0
514	HOUDINI M’s Long Sleeve Shirt /  フーディニ メンズロングスリーブシャツ	サイズ\n着丈(cm)\n身幅(cm)\nゆき(cm)\n重量(g)\nXS\n61.5\n88-92\n81\n168\nS\n63.5\n92-96\n83\n178\nM\n65\n96-100\n85\n188\n\n\n\n\n\n\n素材\nポリエステル Wish Woven™\n\n\n\nカラー\n■Blue Ilusion\n\n■Powderday White\n■True Black\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nMサイズ\n （172cm/62kg 中肉中背）ゆったり目フィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_fb533a4a-3204-4d25-8119-3d2e23832c1e_large.jpg?v=1708931969	20900	https://moonlight-gear.com/collections/topcat-tops/products/132592293	188	65	3	0	0
515	HOUDINI Ws Tree Top /  フーディニ ウィメンズツリートップ	サイズ\n前着丈(cm)\n身幅(cm)\n袖丈(cm)\nS\n54\n116\n32\nM\n56\n122\n34\n\n\n  \n\n\n\n  重量\n160g\n\n\n\n素材\nWoodland Weave 100% TENCEL™ Lyocell\n\n\n\nカラー\n   ■True Black Light■Breeze Blue Light\n \n\n\n\n\n※サイズ選びの参考として\n\n\n  Sサイズ\n \n  （160cm/ 中肉中背）ジャストフィット\n\n\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_e91fdc1f-2e0d-4884-962b-bbe3df8e4649_large.jpg?v=1685964479	17600	https://moonlight-gear.com/collections/topcat-tops/products/254481976	160	65	3	0	0
489	Tripod Ti Power / Power H70	サイズ\nTi Power : H45mm x W48.6mm\n    Power H70 : H70mm x W76.3mm\n\n\n\n重量\nTi Power : 4.1g\nPower H70 : 10.5g\n\n\n\n  素材\nTi Power : チタン\nPower H70 : ステンレス\n  \n\n\n  備考\n耐熱性 : 500℃ (Ti Power)\n    対応火器 : Trangia alcoholStove / EVERNEW Ti alcoholStove (Power H70)\n    \n    ※納品時はワイド幅が狭くなっていますので使用するストーブに合わせてご自身で広げてください。その際は力をかけすぎずにゆっくりと行ってください。	https://moonlight-gear.com/cdn/shop/files/tripod_large.jpg?v=1642991197	4059	https://moonlight-gear.com/collections/cat-stove/products/64339949	4	73	17	0	0
491	EVERNEW BLUENOTEstove set / エバニュー ブルーノートストーブセット	サイズ\nストーブ本体 : 外径50×高さ32mm\n    プレヒートプレート : 径62×高さ7mm\n\n\n\n重量\nストーブ本体 : 13g\nプレヒートプレート : 7g\n\n\n\n容量\n15ml\n\n\n\n素材\nアルミニウム\n\n\n\n  備考\n※燃料用アルコール専用	https://moonlight-gear.com/cdn/shop/files/ss_7cb6fce2-5dfa-4fb0-bcc4-3c5b9aee27cf_large.jpg?v=1650956367	6050	https://moonlight-gear.com/collections/cat-stove/products/254481758	20	75	17	0	0
492	EVERNEW Ti Alcohol Stove / エバニュー チタンアルコールストーブ	サイズ\n径7.1×高さ4.2㎝＝内径3.9㎝\n\n\n \n重量\n34g\n\n\n\n  容量\n70ml\n\n\n\n\n  素材\nチタン\n\n\n\n  備考\n燃料アルコール専用	https://moonlight-gear.com/cdn/shop/files/Ti-Alcohol-Stove_top_large.jpg?v=1643250520	4400	https://moonlight-gear.com/collections/cat-stove/products/35654655	34	75	17	0	0
493	EVERNEW Titanium Cross Stand / エバニュー ＡＬストーブ用チタン十字ゴトク	サイズ\n幅9.6×縦2.8㎝\n\n\n \n重量\n16g\n\n\n\n\n  素材\nチタン	https://moonlight-gear.com/cdn/shop/files/EVERNEW-Titanium-Cross-Stand_large.jpg?v=1643252263	1320	https://moonlight-gear.com/collections/cat-stove/products/35653545	16	75	17	0	0
494	EVERNEW T0.3 triveTi / エバニュー T0.3 トライブチタニウム	サイズ\n75mm×35mm(0.3mm厚)\n\n\n\n重量\n3.5g\n\n\n\n素材\n純チタン (国内製造)\n\n\n\n備考\n  日本製	https://moonlight-gear.com/cdn/shop/files/sn_ce3be06a-386b-4d8d-905e-b15d0484ab03_large.jpg?v=1689152807	1760	https://moonlight-gear.com/collections/cat-stove/products/254482010	3	75	17	0	0
521	Six Moon Designs Silver Shadow Mini / シックスムーンデザインズ シルバーシャドウミニ	サイズ\nシャフト長さ : 52cm（広げた大きさ直径約96cm）\n    収納時長さ：25.4cm\n\n\n\n\n重量\n193g\n\n\n\n\n素材\nハンドル、真部分：プラスティック\n\n\n\n  機能\n紫外線保護指数：50+	https://moonlight-gear.com/cdn/shop/files/sn_3c475593-94d4-490e-84c1-acebb5564a92_large.jpg?v=1692930314	10890	https://moonlight-gear.com/collections/cat-umbrella/products/144034002	193	50	13	0	0
522	Six Moon Designs Silver Shadow Carbon / シックスムーンデザインズ シルバーシャドウカーボン	サイズ\n長さ63cm（広げた大きさ直径約94cm）\n\n\n\n\n重量\n193g\n\n\n\n\n素材\nハンドル、真部分：カーボン\n\n\n\n  機能\n紫外線保護指数：50+	https://moonlight-gear.com/cdn/shop/files/ss_ca65009f-02b1-489b-accb-1a1114e5a86d_large.jpg?v=1656034955	12100	https://moonlight-gear.com/collections/cat-umbrella/products/144032910	193	50	13	0	0
523	Six Moon Designs Rain Walker SUL Umbrella / シックスムーンデザインズ レインウォーカーSULアンブレラ	サイズ\n長さ : 63.5cm（シャフト60cm）\n    使用時直径：94cm\n\n\n\n\n重量\n156g\n\n\n\n\n素材\nキャノピー生地：15D シルナイロン\n    フレーム、シャフト : カーボンファイバー\n    ハンドル : EVAフォーム\n\n\n\n  カラー\n■Green\n    ■Blue	https://moonlight-gear.com/cdn/shop/files/ss_2c765c27-797c-4817-acdc-3fe0c00673b5_large.jpg?v=1654324211	16500	https://moonlight-gear.com/collections/cat-umbrella/products/254481788	156	50	13	0	0
524	Zpacks Lotus UL Umbrella / Zパック ロータスウルトラライトアンブレラ	サイズ\n長さ : 62cm\n直径 : 96.5cm\n\n\n\n\n  \n重量\n192g\n\n\n\n  \n素材\nテフロン撥水加工ポリエステル (UPF40)、グラスファイバー	https://moonlight-gear.com/cdn/shop/files/sn_b33da74b-5297-464d-9aee-8eff017419fe_large.jpg?v=1688454731	11000	https://moonlight-gear.com/collections/cat-umbrella/products/254481995	192	60	13	0	0
501	VARGO Titanium Triad Alcohol Backpacking Stove / バーゴ トライアドアルコールストーブ	サイズ\n収納時 : 6.5cm × 2.6cm　\n    使用時 : 高さ6cm\n\n\n\n\n  重量\n23g\n  \n\n\n  素材\nチタン\n\n\n\n\n  備考\n最大アルコール容量 : 50cc注入可能\n    最大燃焼時間 : 約30分	https://moonlight-gear.com/cdn/shop/files/triad_stove_large.jpg?v=1642663777	5720	https://moonlight-gear.com/collections/cat-stove/products/21266440	23	53	17	0	0
505	UCO　Stormproof Matches / ユーコ ストームプルーフ マッチ	サイズ\nマッチ全長：72mm\n\n\n\n重量\n24g\n\n\n\n  入数\n25本	https://moonlight-gear.com/cdn/shop/files/UCO_stormproof-matches_large.jpg?v=1642985668	1320	https://moonlight-gear.com/collections/cat-stove/products/31002299	24	79	17	0	0
525	Hyperlite Mountain Gear ESSENTIAL UMBRELLA / ハイパーライトマウンテンギア エッセンシャルアンブレラ	サイズ\n\n長さ：61cm\n 直径：96.5cm\n\n\n\n重量\n195g\n\n\n\n備考\nUPF50＋\n ・デュアル キャノピー構造により、強風時の吹き飛ばしが軽減されています。\n ・ソフトで握りやすいハンドルと反射コード\n ・バンジーを備えた超軽量仕様。	https://moonlight-gear.com/cdn/shop/files/sn_f006962b-9e46-4b0d-b509-e84ad44facf5_large.jpg?v=1667270327	11660	https://moonlight-gear.com/collections/cat-umbrella/products/254481861	195	55	13	0	0
532	Hiker Trash H.Y.O.H "HIKE TREK CREW"  / ハイカートラッシュ H.Y.O.H "ハイク トレック クルー"	サイズ\nS : 23.0cm - 25.0cm\n M : 25.0cm - 27.0cm\n L : 27.0cm - 29.0cm\n\n\n\n\n\n素材\nウール79% ナイロン5% ポリエステル13% ポリウレタン3%\n\n\n\nカラー\n  \n■Black / White / DarkBlue\n\n■DarkGreen / Yellow / White\n\n□White / Blue / Red\n\n  □White / DarkBlue / Turquoise\n        ■Gray / Black / White	https://moonlight-gear.com/cdn/shop/files/sn_7605759f-f481-423f-88e1-3391d099db0a_large.jpg?v=1670310388	3190	https://moonlight-gear.com/collections/cat-socks/products/156667700	78	85	19	0	0
526	Tritensil Spoon & Folk/Knife	Regular : 172mm 最大長:255mm (収納時) Mini : 126mm 最大長:195mm (収納時) 重量 Regular : 20g Mini : 8.5g 素材 強化プラスティック (組成：ポリブチレンテレフタレート）	https://moonlight-gear.com/cdn/shop/files/tritensil_large.jpg?v=1642990469	1210	https://moonlight-gear.com/collections/cat-cutlery/products/142224603	20	83	14	0	0
527	高山植物図鑑	サイズ\n22-24cm\n 24-26cm\n 27-29cm\n 総丈：23cm\n\n\n\n\n\n  重量\n22-24cm：64g\n  24-26cm：68g\n    27-29cm：70g\n\n\n\n\n素材\nmerinowool 53%\n nylon 32%\n polyester　12%\n polyurethane 3%\n\n\n\nカラー\n\n■mink\n\n■navy\n\n■white\n\n\n\n備考\n※ネイビーのみ、27-29cmサイズ展開	https://moonlight-gear.com/cdn/shop/files/sn2_bd973d00-1ebf-43ce-84c0-6d3ead909941_large.jpg?v=1713824881	4620	https://moonlight-gear.com/collections/cat-socks/products/254482088	68	84	19	0	0
528	Hiker Trash  ZEN SOCKS / ハイカートラッシュ ゼンソックス	サイズ\nS : 23.0cm - 25.0cm\nM : 25.0cm - 27.0cm\nL :  27.0cm - 29.0cm\n\n  \n\n\n\n      素材\nウール80% ナイロン9% ポリエステル8% ポリウレタン3%\n\n\n\n      カラー\n\n■Olive/Charcoal\n       ■White/Gray\n       ■Charcoal/Black\n       ■Yellow	https://moonlight-gear.com/cdn/shop/files/01_5ce4446a-929e-40f5-9106-6ef971a9f12c_large.jpg?v=1643272654	2750	https://moonlight-gear.com/collections/cat-socks/products/156172638	38	85	19	0	0
529	Hiker Trash "HIKE & RUN" / ハイカートラッシュ "ハイク アンド ラン"	サイズ\nS : 23.0cm - 25.0cm\nM : 25.0cm - 27.0cm\nL :  27.0cm - 29.0cm\n\n  \n\n\n\n      素材\nウール80% ナイロン9% ポリエステル8% ポリウレタン3%\n\n\n\n      カラー\n\n■Chacoal/Navy\n■Olive/Chacoal\n■Yellow/Gray\n■L.Blue/M.Gray	https://moonlight-gear.com/cdn/shop/files/01_95098448-f309-40c5-a120-9e2a7cae9382_large.jpg?v=1643274098	2530	https://moonlight-gear.com/collections/cat-socks/products/159629477	40	85	19	0	0
530	Hiker Trash TRAIL MAGIC / ハイカートラッシュ トレイルマジック	サイズ\nS : 23.0cm - 25.0cm\nM : 25.0cm - 27.0cm\nL :  27.0cm - 29.0cm\n\n  \n\n\n\n      素材\nウール79% ナイロン5% ポリエステル13% ポリウレタン3%\n\n\n\n      カラー\n\n■Charcoal / Olive / Navy\n       ■Olive / Chacoal / Red\n       ■Red / Charcoal / Olive\n       ■Yellow / Charcoal / Gray\n       ■L.Blue / M.Gray / L.Gray	https://moonlight-gear.com/cdn/shop/files/sn_14d85dd1-1582-4c0c-92db-f6763bfc8ec8_large.jpg?v=1694501426	2970	https://moonlight-gear.com/collections/cat-socks/products/156172745	66	85	19	0	0
531	Hiker Trash H.Y.O.H / ハイカートラッシュ H.Y.O.H	サイズ\nS : 23.0cm - 25.0cm\nM : 25.0cm - 27.0cm\nL :  27.0cm - 29.0cm\n\n  \n\n\n\n      素材\nウール79% ナイロン5% ポリエステル13% ポリウレタン3%\n\n\n\n      カラー\n\n■Black / White / DarkBlue\n       ■DarkGreen / Yellow / White\n       ■White / Blue / Red	https://moonlight-gear.com/cdn/shop/files/01_e3887dec-f2d9-490b-9717-2e8d3cc1d7cd_large.jpg?v=1643320813	2970	https://moonlight-gear.com/collections/cat-socks/products/156190204	63	85	19	0	0
534	STUFF PACK XL	X-Pac VX03\n70D PU Coated Ripstop Nylon	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYdEQ74Mpzs9qAKK_Md0Zpe8oya0jmxnv_lZx9UlsNLV_foA4s9mJJGcqs&s=10	4500	https://www.yamatomichi.com/products/stuff-pack-xl	66	17	10	0	0
535	Minimalist Trekking Pole	Material\tCarbon Fiber	https://zpacks.com/cdn/shop/files/Zpacks-Minimalist-Trekking-Poles-02_2048x.jpg?v=1711998173	14300	https://yosemite-store.com/?pid=178190858	144	60	7	0	0
536	キャリー・ザ・サン(CARRY THE SUN)	\n材質 ポリエステル\n商品の寸法 8.8長さ x 8.8幅 x 8.8高さ cm\nサイズ:88×88×88mm(使用時)、170×88×12mm(収納時)\n重量:57g\n仕様:LED6灯\n明るさ:強/30ルーメン、弱/15ルーメン、点滅モード	https://carrythesun.jp/cdn/shop/files/GR-Landport-ServiceSite-product-Thums-M-WL-Wbelt_2x_85090c30-167c-4d20-baa7-d665dfbbd430_1296x.jpg?v=1683961478	3300	https://amzn.asia/d/fzR1Hmr	57	86	9	0	0
293	Spirit Burner	Spirit Burner - 112g	https://hikersdepot.jp/cdn/shop/products/t_spirit_burner.jpg?v=1615427211&width=500	3300	https://hikersdepot.jp/products/spirit-burner	112	7	4	0	0
295	Titan Kettle	Titan Kettle - 138g	https://hikersdepot.jp/cdn/shop/products/msr_titan_kettle.jpg?v=1615355730&width=518	12100	https://hikersdepot.jp/products/titan-kettle	138	2	4	0	0
516	HOUDINI Ws Tree Dress /  フーディニ ウィメンズツリードレス	サイズ\n前着丈(cm)\n身幅(cm)\n袖丈(cm)\nS\n78\n114\n52\nM\n81\n120\n54\n\n\n  \n\n\n\n  重量\n258g\n\n\n\n素材\nWoodland Weave 100% TENCEL™ Lyocell\n\n\n\nカラー\n   ■True Black Light■Breeze Blue Light\n \n\n\n\n\n※サイズ選びの参考として\n\n\n  Sサイズ\n \n  （160cm/ 中肉中背）ジャストフィット\n\n\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_e488e8f9-fa5e-4f0b-b2d9-aad2630966bf_large.jpg?v=1686212997	24200	https://moonlight-gear.com/collections/topcat-tops/products/254481975	258	65	3	0	0
517	HOUDINI W’s Route Shirt Dress / ウィメンズ ルートシャツドレス	サイズ\n前着丈(cm)\n身幅(cm)\n袖丈(cm)\n重量(g)\nS\n88\n57.5\n32\n186\nM\n90.5\n60\n34\n196\n\n\n\n\n\n\n素材\nポリエステル Wish Woven™\n\n\n\nカラー\n\n■Foggy Mountain\n\n■Geyser Grey\n\n\n\n\n※サイズ選びの参考として\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/ss_69a296db-856c-4b14-8bb4-adb7de03cdfc_large.jpg?v=1657009413	24200	https://moonlight-gear.com/collections/topcat-tops/products/150821018	196	65	3	0	0
480	Batchstovez / Gram Weenie Pro	サイズ\n口径：4.5cm\n    高さ：4.4cm\n\n\n重量\n20g (実測値)\n\n\n  素材\nアルミニウム	https://moonlight-gear.com/cdn/shop/files/GramWeeniePro_05_large.jpg?v=1642989755	6050	https://moonlight-gear.com/collections/cat-stove/products/136395450	20	70	17	0	0
481	Batchstovez / H-20 Stove	サイズ\n 高さ：60mm\n  収納時幅：40mm \n    展開時幅：80mm \n\n\n重量\n19g\n\n\n  素材\nアルミニウム	https://moonlight-gear.com/cdn/shop/files/Batchstovez---H-20-Stove_large.jpg?v=1646193580	8250	https://moonlight-gear.com/collections/cat-stove/products/153550438	19	70	17	0	0
482	Batchstovez / I.S. 2.0	サイズ\n高さ：6.7cm\n  五徳直径 : 9cm\n    収納サイズ : 7cm ✕ 6.5cm\n\n\n重量\n41g (実測)\n\n\n  素材\nアルミニウム\n  \n\n\n  備考\n※仕様変更について\n  2019年モデルより仕様変更がありました。中央ネジ部分を押すと中にアルコールが注入されるスプリング型にアップデート。\n    メーカー説明によると、以前までのネジ部分が取れるモデルだと山の中で紛失してしまうケースが多数あったために より使いやすく改良した、との説明がありました。	https://moonlight-gear.com/cdn/shop/files/IS20Stove_top3_large.jpg?v=1642990333	8580	https://moonlight-gear.com/collections/cat-stove/products/136396502	41	70	17	0	0
483	Batch Stovez / B.S 1.1 Adjustable Flame Stove	サイズ\n高さ：76.2mm\n直径 : 50.8mm\n\n\n\n\n重量\n60.7g\n\n\n\n燃料容量\n約28g\n\n\n\n素材\nアルミニウム	https://moonlight-gear.com/cdn/shop/files/ss_280151f1-5a11-43ed-b6a3-7e68de804a3b_large.jpg?v=1654741248	16500	https://moonlight-gear.com/collections/cat-stove/products/254481796	60	70	17	0	0
484	Qiwiz / Titanium UL Windscreens	サイズ\nSmall : 直径12cm x 高さ7.5cm\n Medium : 直径15cm x 高さ7.5cm\n Large : 直径17cm x 高さ7.5cm\n\n\n\n重量\nSmall : 13g\n Medium : 16g\n Large : 19g\n\n\n\n\n\n\n素材\nチタン	https://moonlight-gear.com/cdn/shop/files/sn_95674cc2-d020-4467-bab5-168dddb5e982_large.jpg?v=1713338192	6930	https://moonlight-gear.com/collections/cat-stove/products/254482090	16	71	17	0	0
490	MUNIEQ / X-Mesh Stove	X-Mesh Stove (Small)\n \n\n\nサイズ\n124mm×67mm\n 組み立てサイズ : Φ62×H67mm\n\n\n\n\n\n重量\n12g\n\n\n\n素材\nマイクロメッシュステンレスシート（厚さ0.17mm)\n\n\n\n耐荷重\n1kg\n\n\n\n価格\n2,750円（税込）\n\n\n\n備考\n・複数連結することが可能。\n 1個 : Φ62×H67mm\n 外径が55㎜以下のアルコールストーブ、固形燃料が使用可能\n\n 2個連結時 : Φ124×H67mm\n 一般的なサイズのアルコールストーブ（トランギア、エスビット、エバニューなど）、固形燃料が使用可能\n\n\n\n\n\nX-Mesh Stove (Large)\n \n\n\nサイズ\n272mm×67mm\n 組み立てサイズ : Φ82×H67mm\n ３段階に調整可能（Φ：82mm、72mm、62mm）\n\n\n\n\n重量\n17g\n\n\n素材\nマイクロメッシュステンレスシート（厚さ0.17mm)\n\n\n\n耐荷重\n1kg\n\n\n\n価格\n3,520円（税込）\n\n\n\n備考\n・一般的なサイズのアルコールストーブ（トランギア、エスビット、エバニューなど）固形燃料が使用可能\n ・EVERNEWのチタンマグポット500/900の溝にフィットし安定	https://moonlight-gear.com/cdn/shop/files/sn_6ca97480-106d-4530-8eae-5d70e456a1e4_large.jpg?v=1680838055	2750	https://moonlight-gear.com/collections/cat-stove/products/254481925	12	74	17	0	0
495	EVERNEW Ti9G Windshield / エバニュー チタン9G ウインドシールド	サイズ\n405×50mm\n\n\n\n  組立時サイズ\n径124 or 108×高さ60mm(0.1mm厚)\n\n\n\n重量\n9g\n\n\n\n\n\n素材\n純チタン(国内製造)\n\n\n\n\n生産国\n日本	https://moonlight-gear.com/cdn/shop/files/sn_06920c78-834f-480e-a7e9-1072795690d9_large.jpg?v=1694649641	2970	https://moonlight-gear.com/collections/cat-stove/products/254482036	9	75	17	0	0
496	EVERNEW Ti フーボー / エバニュー チタンフーボー	サイズ\n40.5cmｘ5cm\n    組立時：高さ86ｍｍ 径12.4cm・径10.8cm (0.1ｍｍ厚) \n\n\n\n重量\n17g\n\n\n\n素材\nチタン	https://moonlight-gear.com/cdn/shop/files/sn_c5e03fb2-4b9f-41c6-b682-27fc54ce13ec_large.jpg?v=1669793599	5280	https://moonlight-gear.com/collections/cat-stove/products/254481890	17	75	17	0	0
497	EVERNEW VESUV Windshield  0.9L pot / エバニュー VESUVウインドシールド 0.9Lポット ok	サイズ\n径155×高さ125mm\n\n\n\n  収納サイズ\n径32×長さ127mm\n\n\n\n\n重量\n24g\n\n\n\n\n\n素材\nチタン\n\n\n\n\n生産国\nチェコ	https://moonlight-gear.com/cdn/shop/files/sn_191080bf-625d-4e0b-ad25-e36a1969baf5_large.jpg?v=1694649786	7480	https://moonlight-gear.com/collections/cat-stove/products/254482038	24	75	17	0	0
498	Iwatani Primus / 116フェムトストーブⅡ	出力\n2.5kW／2,100kcal/h（Tガス使用時）\n\n\n\nガス消費量\n170g/h\n\n\n\n燃焼時間\n約80分（IP-250ガス使用時）\n\n\n\n\n\nゴトク径\n大120mm／小80mm\n\n\n\n収納サイズ\n5.4×7.4×2.7cm\n\n\n\n本体重量\n64g\n\n\n\n  備考\n・ナイロンスタッフバッグ付属\n    ・ガスカートリッジ別売	https://moonlight-gear.com/cdn/shop/files/sn_b60224dd-6bb4-4821-bc84-05cc4b358225_large.jpg?v=1689326116	8800	https://moonlight-gear.com/collections/cat-stove/products/254481987	64	76	17	0	0
499	MSR Pocket Rocket 2 / エムエスアール ポケットロケット２	サイズ\n3.4×4.4×7.9cm\n  \n\n\n  重量\n73g（ケース、ガスカートリッジを除く）\n  \n\n\n  最高出力\n2,143kcal/h\n  \n\n\n  使用可能燃料\n  イソプロ\n  \n\n\n\n  備考\n  \n    ※上記詳細写真のガスカートリッジは付属しません。\n            【ご注意】 \n            専用ガスカートリッジのISOPRO以外は絶対に使用しないでください。 \n            MSRのストーブはISOPROに合わせて精密に設計されております。 \n            他社製ガスカートリッジを使用すると、ガスの混合比の違いにより酸素が不足し、不完全燃焼となり一酸化炭素が発生し、中毒に陥り高次脳機能障害などの後遺症、意識障害、最悪の場合は死亡事故を引き起こす可能性があります。 \n              また、ネジ山のピッチの違いによりガス漏れが発生し、爆発、火災、怪我、重度のやけど、最悪の場合は死亡事故を引き起こす可能性があります。	https://moonlight-gear.com/cdn/shop/files/MSR-Pocket-Rocket2_large.jpg?v=1643338757	9020	https://moonlight-gear.com/collections/cat-stove/products/159521703	73	54	17	0	0
500	MSR Lowdown Remote Stove Adapter / エムエスアール ローダウンリモートストーブアダプター	サイズ\n3.6cm(W)×13cm(L)×4.3cm(H)\n\n\n\n\n\n重量\n180g\n\n\n\n素材\nステンレススチール、真鍮、亜鉛、ニトリル\n\n\n\n\n使用可能燃料\nイソプロ\n\n\n\n対応機器\nポケットロケット2、ウィンドバーナーパーソナル\n\n\n\n備考\n\n※上記詳細写真のストーブ本体、ガスカートリッジは付属しません。\n\n【ご注意】 \n            専用ガスカートリッジのISOPRO以外は絶対に使用しないでください。 \n            MSRのストーブはISOPROに合わせて精密に設計されております。 \n            他社製ガスカートリッジを使用すると、ガスの混合比の違いにより酸素が不足し、不完全燃焼となり一酸化炭素が発生し、中毒に陥り高次脳機能障害などの後遺症、意識障害、最悪の場合は死亡事故を引き起こす可能性があります。 \n              また、ネジ山のピッチの違いによりガス漏れが発生し、爆発、火災、怪我、重度のやけど、最悪の場合は死亡事故を引き起こす可能性があります。	https://moonlight-gear.com/cdn/shop/files/sn_5cd66a09-9ef4-4bb1-9d15-72f8609dcd9c_large.jpg?v=1686548435	8800	https://moonlight-gear.com/collections/cat-stove/products/254481986	180	54	17	0	0
502	FireDragon SOLID FUEL 27g (6 BLOCKS) / ファイヤードラゴン ファイヤードラゴン ソリッドフューエル 27g (6個入)	入数\n６個入\n\n\n\n\n\n\n重量\n27g /個\n\n\n\n素材\nエタノール91%\n 凝固剤9％\n\n\n\n\n注備\n1.着火後、固形燃料は液化します。そのため液体をこぼさない構造のストーブで使用してください。\n 2.個包装を開封した後は気化しますので、早めに使用してください。\n 3.この製品は固形燃料のみで、ストーブは付属しません。\n\n 自然発火温度363度（よって、放置により勝手に発火はしない）\n\n Made in Wales	https://moonlight-gear.com/cdn/shop/files/sn_cdd4a441-94ac-4723-b1e1-df23ef9160d2_large.jpg?v=1711321026	990	https://moonlight-gear.com/collections/cat-stove/products/158322744	27	77	17	0	0
503	FireDragon SOLID FUEL 14g (12 BLOCKS) / ファイヤードラゴン ソリッドフューエル 14g (12個入)	入数\n12個\n\n\n\n\n\n重量\n14g /個\n\n\n\n素材\nエタノール91%\n 凝固剤9％\n\n\n\n\n  製品特徴\n- 濡れていても着火できるため、小雨でも利用可\n  - 素早い着火が可能\n  - 14gブロック1個当たり5分程度燃焼(500mlの水を沸騰させるのに6分強)\n  - 燃料はナイフで簡単にカット可能。カットしたナイフで食材を扱うことができる\n  - 食料と一緒に保管、携帯しても安全\n    - 手の消毒にも使える\n\n\n\n注意\n1.着火後、固形燃料は液化します。そのため液体をこぼさない構造のストーブで使用してください。\n 2.個包装を開封した後は気化しますので、早めに使用してください。\n 3.この製品は固形燃料のみで、ストーブは付属しません。\n\n\n 自然発火温度363度（勝手に発火することはありません）\n   \n\n    Made in England Wales	https://moonlight-gear.com/cdn/shop/files/sn_f34bfa22-66c6-42a2-8b5c-932f90d61f5e_large.jpg?v=1689318244	1210	https://moonlight-gear.com/collections/cat-stove/products/254482013	14	77	17	0	0
504	Epiphany Outdoor Gear / Pocket Bellows	Baddest Bee Fire Fuse" Tinder Torches\n \n\n\n重量\n8pack : 10.5g  \n 20pack : 22g\n\n\n\n素材\n蜜蝋・オリーブオイル\n\n\n備考\n防水キャップ付き密封ケース\n\n\n\n\nV3-Pocket Bellows\n \n\n\nサイズ\n収納時8.8cm 最大時50cm\n\n\n\n重量\n20g\n\n\n素材\nstainless steel\n\n\n備考\n防水キャップ付き密封ケース\n\n\n\n\nEOG Weatherproof Kit\n \n\n\nセット内容\n・V3-Pocket Bellows\n ・Tinder Torchespacks\n ・EZ Ignite\n\n\n\n重量\n65g（セット）\n\n\n備考\n防水キャップ付き密封ケース	https://moonlight-gear.com/cdn/shop/files/Epiphany-Outdoor-Gear---Pocket-Bellows_302bbbd2-866b-4adb-ba09-b371cd45835d_large.jpg?v=1643180181	990	https://moonlight-gear.com/collections/cat-stove/products/110642733	11	78	17	0	0
319	Down Bag	Down Bag - 555g	https://hikersdepot.jp/cdn/shop/products/downbag4th_cut_2.jpg?v=1615772992&width=922	45100	https://hikersdepot.jp/products/down-bag	555	15	1	0	0
506	EXOTAC MATCHCAP XL / エクソタック マッチキャップ XL	サイズ\n直径 : 約3cm\n \n長さ : 約9cm\n\n\n\n重量\n約35g\n\n\n\n素材\nアルミニウム\n\n\n\nカラー\n■Black\n\n■Gunmetal\n\n■Olive\n■Orange\n\n\n\nセット内容\n本体×1、キャップ×1、\n    交換用付属品 (赤燐パッド×1、摩擦パッド×1、Oリング×1）\n\n\n\n  備考\n※マッチは付属しておりません	https://moonlight-gear.com/cdn/shop/files/ss_6aa78efc-5a39-4319-9783-87081066b435_large.jpg?v=1649302792	4950	https://moonlight-gear.com/collections/cat-stove/products/37026286	35	80	17	0	0
507	EXOTAC FIRESLEEVE / エクソタック ファイヤースリーブ	内容\n本体×1、キャップ×1\n\n\n\nサイズ\n全長：約12.6cm\n\n\n\n  \n重量\n約42.5g\n\n\n\n防水性\n水深約1m\n\n\n\n  カラー\n■Black\n    ■Orange\n  \n\n\n  備考\n※ファイヤースリーブはBIC社製J26レギュラーライター専用のケースです。	https://moonlight-gear.com/cdn/shop/files/ss_00edaa69-542f-4253-b4bc-680b31b02329_large.jpg?v=1657868041	2530	https://moonlight-gear.com/collections/cat-stove/products/254481825	42	80	17	0	0
508	EXOTAC nanoSPARK / エクソタック ナノスパーク	サイズ\n直径 : 1.3cm\n    長さ : 6.9cm\n  \n\n \n   重量\n17g\n\n\n \n素材\nアルミニウム\n\n\n\n  カラー\n■Black\n■Olive\n\n■Gunmetal\n    ■Orange\n\n\n\n  付属品\nquickLIGHT™ Tinder × 4	https://moonlight-gear.com/cdn/shop/files/EXOTAC-nanoSPARK_large.jpg?v=1643259440	4180	https://moonlight-gear.com/collections/cat-stove/products/150358235	17	80	17	0	0
314	U.L.Pad 15s+	U.L.Pad 15s+ - 113g	https://hikersdepot.jp/cdn/shop/products/IMG_1637_1.jpg?v=1615773061&width=480	5060	https://hikersdepot.jp/products/ul-pad-15s	113	17	1	5	1
455	Senchi Designs ALPHA 60 CREWNECK / センチデザイン アルファ60クルーネック	サイズ\n 着丈(cm)\n 身幅(cm)\n ゆき(cm)\n重量(g)\n\nM\n66\n51\n81\n96\nL\n69\n53\n84\n108\n\nXL\n71\n58\n85\n119\n\n\n\n\n\n\n素材\n\n\nPolartec® Alpha Direct 60 insulation \n78% recycled polyester\n\n\n\n\nカラー\n■Clay / ■Smoke\n\n\n\n備考\n・SENCHI BAG付属\n ※SENCHI BAGは多機能ウォッシュバッグです。PETプラスチックアパレルからのマイクロプラスチック廃棄物を減らし、洗濯の際に衣類を保護し、その他のギアの保管のために設計されています。\n\n\n\n\n※サイズ選びの参考として\n\n\nMサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nLサイズ\n （172cm/62kg 中肉中背）ゆったりフィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_c6a67e45-ce11-4942-8048-9026b85a4429_large.jpg?v=1715213197	19800	https://moonlight-gear.com/collections/cat-topsinsulation/products/254482097	96	63	16	0	0
456	Senchi Designs ALPHA 60 HOODIE / センチデザイン アルファ60フーディ	サイズ\n 着丈(cm)\n 身幅(cm)\n ゆき(cm)\n重量(g)\n\nM\n67\n52\n83\n105\nL\n70\n56\n86\n116\n\nXL\n74\n58\n89\n125\n\n\n\n\n\n\n素材\n\n\nPolartec® Alpha Direct 60 insulation\n 78% recycled polyester\n\n\n\n\nカラー\n■Ember\n\n■Dusk\n\n\n\n備考\n・SENCHI BAG付属\n ※SENCHI BAGは多機能ウォッシュバッグです。PETプラスチックアパレルからのマイクロプラスチック廃棄物を減らし、洗濯の際に衣類を保護し、その他のギアの保管のために設計されています。\n\n\n\n\n※サイズ選びの参考として\n\n\nMサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nLサイズ\n （172cm/62kg 中肉中背）ゆったりフィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn2_4f706e57-1349-46e6-870e-ed73cb35bc7b_large.jpg?v=1715332540	22000	https://moonlight-gear.com/collections/cat-topsinsulation/products/254482096	116	63	16	0	0
457	Senchi Designs ALPHA 90 HOODIE W/ HALF ZIP / センチデザイン センチデザイン アルファ90フーディ ウィズ ハーフジップ	サイズ\n 着丈(cm)\n 身幅(cm)\n ゆき(cm)\n重量(g)\n\nM\n67\n52\n84\n130\nL\n70\n56\n86\n139\n\nXL\n74\n58\n89\n150\n\n\n\n\n\n\n素材\n Polartec® Alpha Direct 90 insulation (85g/m2)\n 78% Recycled Polyester (P.E.T.) \n\n\n\nカラー\n■Dusk\n■Dune\n\n  ■Dark Sage\n\n\n\n備考\n・SENCHI BAG付属\n ※SENCHI BAGは多機能ウォッシュバッグです。PETプラスチックアパレルからのマイクロプラスチック廃棄物を減らし、洗濯の際に衣類を保護し、その他のギアの保管のために設計されています。\n\n\n\n\n※サイズ選びの参考として\n\n\nMサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nLサイズ\n （172cm/62kg 中肉中背）ゆったりフィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_fb2dff72-730c-4aaf-b0df-30a2127b0d44_large.jpg?v=1713857824	27500	https://moonlight-gear.com/collections/cat-topsinsulation/products/254481955	130	63	16	0	0
459	ENLIGHTENED EQUIPMENT / Men's Torrid Pullover	サイズ\n身幅(cm)\nウエスト(cm）\nヒップ(cm)\nゆき(cm)\nS\n91-99\n76-84\n89-96\n76-81\nM\n101-109\n87-94\n99-106\n79-84\nL\n111-119\n97-104\n109-116\n81-86\n\n\n\n\n\n\n重量\nS : 192g\n M : 253g\n L : 265g\n ※実測平均値 \n\n\n\n素材\n表地：10D - 0.65oz per yard²Ultralight nylon \n 中綿：2oz/yd² CLIMASHIELD™\n\n\n\nカラー\n  ■■Black/Charcoal\n              ■■Navy/Charcoal\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nMサイズ\n （172cm/62kg 中肉中背）ゆったり目フィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn1_large.jpg?v=1712303269	41800	https://moonlight-gear.com/collections/cat-topsinsulation/products/162162670	253	64	16	0	0
460	HOUDINI Ms Mono Air Vest /  フーディニ メンズモノエアベスト	サイズ\n前着丈(cm)\n身幅(cm)\n裾幅(cm)\n\nM \n61\n111\n109\nL \n63\n117\n115\n\n\n\n\n\n\n重量\n326g\n\n\n\n素材\nMain fabric : Polartec® Power Air Light 73% recycled polyester, 27% elastomultiester\n Detail fabric : C9 Ripstop™ 100% recycled polyester\n\n\n\nカラー\n■True Black\n\n\n\n\n\n※サイズ選びの参考として\n\n\nMサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_30cd6dc9-cecc-4009-8798-956d926463b5_large.jpg?v=1701934933	23100	https://moonlight-gear.com/collections/cat-topsinsulation/products/254482065	326	65	16	0	0
320	NeoAir XTherm & XTherm Max	NeoAir XTherm & XTherm Max - 430g	https://hikersdepot.jp/cdn/shop/products/neoair_xtherm_1.jpg?v=1615772979&width=800	35200	https://hikersdepot.jp/products/neoair-xtherm-max	430	24	1	0	0
318	TOP QUILT	TOP QUILT - 360g	https://hikersdepot.jp/cdn/shop/products/topquilt_sq_1.jpg?v=1615773008&width=1174	26400	https://hikersdepot.jp/products/top-quilt	360	15	1	0	0
260	GEL BURNER	GEL BURNER - 17g	https://hikersdepot.jp/cdn/shop/products/IMG_7032.jpg?v=1615427249&width=2448	1045	https://hikersdepot.jp/products/gel-burner	17	7	4	0	0
244	LEVEL	LEVEL - 88g	https://hikersdepot.jp/cdn/shop/products/IMG_8970.jpg?v=1615433984&width=3024	11000	https://hikersdepot.jp/products/level	88	28	4	0	0
296	JIN CUP UL	JIN CUP UL - 60g	http://hikersdepot.jp/cdn/shop/products/JIN_CUP_UL.jpg?v=1615265358&width=640	9460	https://hikersdepot.jp/products/jin-cup-ul	60	25	4	0	0
265	Titanium Travel Mug450	Titanium Travel Mug450 - 58g	https://hikersdepot.jp/cdn/shop/products/vargo450.jpg?v=1621676700&width=3024	5720	https://hikersdepot.jp/products/titanium-travel-mug450	58	12	4	0	0
312	UL DOWN QUILT	UL DOWN QUILT - 400g	https://hikersdepot.jp/cdn/shop/files/ul_down_quilt_01_sq.jpg?v=1724403503&width=860	48400	https://hikersdepot.jp/products/ul-down-quilt	400	15	1	0	0
306	EZ Zip Off Pants	EZ Zip Off Pants - 257g	https://hikersdepot.jp/cdn/shop/files/hd_easyZOpant_2.jpg?v=1722662845&width=3024	16500	https://hikersdepot.jp/products/ez-zip-off-pants	257	15	6	0	0
308	100%  Merino Light Hoody	100%  Merino Light Hoody - 208g	https://hikersdepot.jp/cdn/shop/products/100merinolighthoody_3.jpg?v=1711861684&width=3024	16500	https://hikersdepot.jp/products/100-merino-light-hoody	208	17	3	0	0
248	Ti POT 750ml NH	Ti POT 750ml NH - 80g	https://hikersdepot.jp/cdn/shop/products/IMG_6706-345x345.jpg?v=1630813607&width=345	5170	https://hikersdepot.jp/products/ti-pot-750ml-nh	80	23	4	0	0
405	OMM Rotor Foot Pod / OMM ローターフットポッド	サイズ\nワンサイズ\n パッキングサイズ : 10cm x 12 cm\n\n\n\n重量\n55g\n\n\n\n\n\n素材\nPrimaloft Cross-Core ECO GOLD 60g\n PointZero 100 22gsm nylon ripstop fabric\n ・ダウンプルーフ\n ・DWR加工　防風\n\n\n\n\nカラー\n■Black\n\n\n\n断熱性能\n3.0 TOG （乾燥状態）\n 2.2 TOG （濡れた状態）\n\n\n\n\n備考\n・Rotor Hood Jacket 、 Rotor Pantと組み合わせて、軽量で順応性のあるスリープシステムを実現します。\n\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。	https://moonlight-gear.com/cdn/shop/files/sn_8a48cae9-275e-4681-a1fc-66f02939985c_large.jpg?v=1674438043	8800	https://moonlight-gear.com/collections/topcat-sleeping/products/254481906	55	29	1	0	0
327	Mountain Laurel Designs / SHOULDER BOTTLE POCKET	サイズ\n高さ 18cm x 周囲 25cm\n\n\n\n重量\n40g\n\n\n\n素材\nEcoPak Ultra 200\n 4 Way Stretch Tough Mesh\n\n\n\nカラー\n■Gray\n\n\n\n\n備考\n\nMADE IN USA\n\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。  ご注文前にあらかじめご了承下さい。	https://moonlight-gear.com/cdn/shop/files/ss_bbe1d13d-f053-49e1-be56-8dcd1809a414_large.jpg?v=1661320681	6160	https://moonlight-gear.com/collections/topcat-backpack/products/125912713	40	6	5	0	0
328	Hyperlite Mountain Gear 3400 Ice Pack /  ハイパーライトマウンテンギア 3400 アイスパック	容量\n\n55L\n\n\n重量\nS : 817g\n M : 823g\n\n\n背面長サイズ\nS : 38.1cm - 43.18cm\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n素材\n ボディ : 50D Dyneema®/Poly hybrid\n ボトム : Double reinforced 150D Dyneema®/Poly hybrid\n クランポンパッチ : Dyneema® Hardline \n\n\nカラー\n\n□White\n\n\n備考\nフレーム付き	https://moonlight-gear.com/cdn/shop/files/3400_ice_white_front_2_large.jpg?v=1643357256	68200	https://moonlight-gear.com/collections/topcat-backpack/products/126760341	817	13	5	0	0
299	Welded Wire Stove Stand	Welded Wire Stove Stand - 12g	https://hikersdepot.jp/cdn/shop/products/ww_front.jpg?v=1712646421&width=800	2100	https://hikersdepot.jp/products/welded-wire-stove-stand	12	8	4	0	0
313	Versalite 6'	Versalite 6' - 1020g	https://hikersdepot.jp/cdn/shop/products/versalite.jpg?v=1615773076&width=400	108460	https://hikersdepot.jp/products/versalite-6	1020	20	1	0	0
310	Trail mat	Trail mat - 180g	https://hikersdepot.jp/cdn/shop/files/trailmat100_1-1080x1080.jpg?v=1713591952&width=1188	3190	https://hikersdepot.jp/products/trail-mat	180	36	1	0	0
307	L/S Self Guided Hike Shirt	L/S Self Guided Hike Shirt - 184g	https://hikersdepot.jp/cdn/shop/files/pt_sghs_CS_1.jpg?v=1715849684&width=1920	12100	https://hikersdepot.jp/products/self-guided-hike-shirt	184	1	3	0	0
242	2F-PL/Ti	2F-PL/Ti - 5g	https://hikersdepot.jp/cdn/shop/files/2fpl_ti_3.heic?v=1714292014&width=3024	4730	https://hikersdepot.jp/products/2f-pl-ti	5	28	4	0	0
256	JETPOWER100G	JETPOWER100G - 194g	https://hikersdepot.jp/cdn/shop/files/IMG_2545-520x520.jpg?v=1712223374&width=520	605	https://hikersdepot.jp/products/jetpower100g	194	4	4	0	0
250	高耐熱アルミ付きシリコンフォームシート	高耐熱アルミ付きシリコンフォームシート - 7g	https://hikersdepot.jp/cdn/shop/files/IMG_2724-520x390.jpg?v=1712649031&width=520	1430	https://hikersdepot.jp/products/silicon-foam-sheet	7	15	4	0	0
264	BACKCOUNTRY ALMIPOT	BACKCOUNTRY ALMIPOT - 127g	https://hikersdepot.jp/cdn/shop/files/IMG_3042-520x520.jpg?v=1711865260&width=520	5280	https://hikersdepot.jp/products/backcountry-almipot	127	36	4	0	0
262	Hillbilly Pot 350	Hillbilly Pot 350 - 61g	https://hikersdepot.jp/cdn/shop/files/hbp350tp-520x520.jpg?v=1712138519&width=520	5940	https://hikersdepot.jp/products/hillbilly-pot-350	61	11	4	0	0
249	UltraLight Folding Table	UltraLight Folding Table - 62g	https://hikersdepot.jp/cdn/shop/products/IMG_3105.jpg?v=1615433961&width=3024	2090	https://hikersdepot.jp/products/ultralight-folding-table	62	19	4	0	0
258	Ti POT 550ml NH	Ti POT 550ml NH - 57g	https://hikersdepot.jp/cdn/shop/products/IMG_6702-345x345.jpg?v=1630813356&width=345	6600	https://hikersdepot.jp/products/ti-pot-550ml-nh	57	23	4	0	0
292	MINI SET	MINI SET - 168g	https://hikersdepot.jp/cdn/shop/products/tr_miniseto7.jpg?v=1649240824&width=3024	1650	https://hikersdepot.jp/products/mini-set	168	7	4	0	0
255	Stash	Stash - 203g	https://hikersdepot.jp/cdn/shop/products/stash_1.jpg?v=1615427289&width=536	19800	https://hikersdepot.jp/products/stash	203	4	4	0	0
254	チタンスモールスプーン	チタンスモールスプーン - 10g	https://hikersdepot.jp/cdn/shop/products/mizo_ti_s_spoonjpg.jpg?v=1615433897&width=379	660	https://hikersdepot.jp/products/titan-smallspoon	10	26	4	0	0
246	HOVERLIGHT SPORK	HOVERLIGHT SPORK - 7g	https://hikersdepot.jp/cdn/shop/products/hvlt_1.jpg?v=1674875444&width=3024	3300	https://hikersdepot.jp/products/hoverlight-spork	7	5	4	0	0
243	MP500 FLAT	MP500 FLAT - 78g	https://hikersdepot.jp/cdn/shop/products/ev_mp500flat_1.jpg?v=1678529762&width=3024	6050	https://hikersdepot.jp/products/mp500-flat	78	36	4	0	0
252	Measure Cap PP Bottle	Measure Cap PP Bottle - 18g	https://hikersdepot.jp/cdn/shop/products/PP.jpg?v=1636794370&width=3024	440	https://hikersdepot.jp/products/measure-cap-100ml	18	16	4	0	0
261	除菌もできる燃料用アルコール	除菌もできる燃料用アルコール - 400g	https://hikersdepot.jp/cdn/shop/products/LINDEN1.jpg?v=1622017193&width=2448	1320	https://hikersdepot.jp/products/jyokinalcohol	400	35	4	0	0
300	Titanium Stove	Titanium Stove - 13g	https://hikersdepot.jp/cdn/shop/products/esbit_ti_wing_stove_3.jpg?v=1712644145&width=1000	3300	https://hikersdepot.jp/products/titanium-stove	13	33	4	0	0
325	Thru-hiker Zip-off-not Pants	Thru-hiker Zip-off-not Pants - 265g	https://hikersdepot.jp/cdn/shop/products/zo_not_1.jpg?v=1616120838&width=3024	14300	https://hikersdepot.jp/products/thru-hiker-zip-off-not-pants	265	14	6	0	0
323	Thru-hiker Zip Off Pants	Thru-hiker Zip Off Pants - 308g	https://hikersdepot.jp/cdn/shop/products/tb_thzop_hd11-e1588241721220.jpg?v=1712643170&width=1200	20900	https://hikersdepot.jp/products/thru-hiker-zip-off-pants-trailbum	308	14	6	0	0
322	RidgeRest® Classic Regular	RidgeRest® Classic Regular - 400g	https://hikersdepot.jp/cdn/shop/products/ridgerestclassic.jpg?v=1615772916&width=847	5830	https://hikersdepot.jp/products/ridgerest-classic	400	24	1	0	0
321	Flap Wrap Ⅱ	Flap Wrap Ⅱ - 339g	https://hikersdepot.jp/cdn/shop/products/flapwrapII_1.jpg?v=1615772952&width=3024	35200	https://hikersdepot.jp/products/flap-wrap-ii	339	15	1	0	0
317	Winter Down Bag	Winter Down Bag - 885g	https://hikersdepot.jp/cdn/shop/products/wbd_square.jpg?v=1615773031&width=780	64680	https://hikersdepot.jp/products/winter-down-bag	885	15	1	0	0
315	Minimo Quilt II	Minimo Quilt II - 240g	https://hikersdepot.jp/cdn/shop/files/minimo_quilt_IV_02_sq.jpg?v=1724403963&width=860	36300	https://hikersdepot.jp/products/minimo-quilt-ii	240	15	1	0	0
311	FPmat 100	FPmat 100 - 160g	https://hikersdepot.jp/cdn/shop/files/fpmat100_1-1080x1080.jpg?v=1713591848&width=1202	3190	https://hikersdepot.jp/products/fpmat-100	160	36	1	0	0
305	TRIPLE CROWN BUTTON DOWN LONG SLEEVE	TRIPLE CROWN BUTTON DOWN LONG SLEEVE - 260g	https://hikersdepot.jp/cdn/shop/files/jollygear_triplecrown_1_d92a3aad-f380-4781-9152-928c6bd934db.jpg?v=1713592958&width=1306	19800	https://hikersdepot.jp/products/triple-crown-button-down-long-sleeve	260	30	3	0	0
309	TECNO Wool Sweat T	TECNO Wool Sweat T - 223g	https://hikersdepot.jp/cdn/shop/products/tecnowool_sweat_t_02.jpg?v=1712637277&width=3024	11000	https://hikersdepot.jp/products/tecno-wool-sweat-t	223	31	3	0	0
290	Titan Alcohol Stove	Titan Alcohol Stove - 35g	https://hikersdepot.jp/cdn/shop/files/2015-08-27-14.51.30-1080x1080.jpg?v=1712643833&width=1080	5280	https://hikersdepot.jp/products/titan-alcohol-stove	35	36	4	0	0
259	ISOPRO110	ISOPRO110 - 210g	https://hikersdepot.jp/cdn/shop/files/IMG_9307-520x520.jpg?v=1712218786&width=520	770	https://hikersdepot.jp/products/isopro110	210	2	4	0	0
257	Windburner	Windburner - 465g	https://hikersdepot.jp/cdn/shop/files/IMG_9311-768x768.jpg?v=1712646563&width=768	31900	https://hikersdepot.jp/products/windburner	465	2	4	0	0
245	Ti SOLO POT Nh	Ti SOLO POT Nh - 64g	https://hikersdepot.jp/cdn/shop/files/ev_tinh_1.jpg?v=1685181593&width=3024	6380	https://hikersdepot.jp/products/ti-solo-pot-nh	64	36	4	0	0
294	Titanium Ultralight Cooker 1	Titanium Ultralight Cooker 1 - 97g	https://hikersdepot.jp/cdn/shop/products/IMG_3336.jpg?v=1615355735&width=800	5720	https://hikersdepot.jp/products/titanium-ultralight-cooker-1	97	36	4	0	0
253	Pot Handle	Pot Handle - 20g	https://hikersdepot.jp/cdn/shop/products/uid000002_20100311173804ae169aa4.jpg?v=1615433906&width=320	715	https://hikersdepot.jp/products/pot-handle	20	7	4	0	0
297	TriPod	TriPod - 3g	https://hikersdepot.jp/cdn/shop/products/power_front.jpg?v=1712645162&width=800	6050	https://hikersdepot.jp/products/tripod	3	32	4	0	0
263	INFINITY STORAGE SET	INFINITY STORAGE SET - 252g	https://hikersdepot.jp/cdn/shop/products/iss.jpg?v=1621740878&width=3024	2860	https://hikersdepot.jp/products/infinity-storage-set	252	18	4	0	0
247	BLUENOTE stove w/ pre-heating plate	BLUENOTE stove w/ pre-heating plate - 20g	https://hikersdepot.jp/cdn/shop/products/ev_bluenote_7.jpg?v=1645094577&width=3024	6930	https://hikersdepot.jp/products/bluenote-stove-w-pre-heating-plate	20	36	4	0	0
251	Solid Fuel	Solid Fuel - 4g	https://hikersdepot.jp/cdn/shop/products/esbit_4g.jpg?v=1615433922&width=655	814	https://hikersdepot.jp/products/solid-fuel	4	33	4	0	0
291	Pasta Pot S	Pasta Pot S - 94g	https://hikersdepot.jp/cdn/shop/products/Pasta_Pot1.jpg?v=1615355748&width=700	7260	https://hikersdepot.jp/products/pasta-pot-s	94	36	4	0	0
329	Hyperlite Mountain Gear 3400 Southwest /  ハイパーライトマウンテンギア 3400 サウスウエスト	容量\n\n55L\n\n\n重量\nS : 947g \n M : 965g\n\n\n背面長サイズ\nS : 38.1cm - 43.18cm\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n素材\nボディ : 150D Dyneema®/Poly hybrid \n ボトム : Double reinforced 150D Dyneema®/Poly hybrid\n ポケット : Dyneema® Hardline\n\n\nカラー\n■Black\n\n\n備考\nフレーム付き	https://moonlight-gear.com/cdn/shop/files/01_3060dc67-ea72-41f9-821b-e5f3d13e550a_large.jpg?v=1643357476	68200	https://moonlight-gear.com/collections/topcat-backpack/products/126584309	947	13	5	0	0
331	Hyperlite Mountain Gear  ELEVATE 22 /  ハイパーライトマウンテンギア エレベート 22	容量\n\n22L\n\n\n\n\n\n重量\n\n507g (M Size)\n\n\n\n\n\n背面長サイズ\n\nS : 38.1cm - 43.18cm\n\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n\n\n\nヒップベルトサイズ\n\n71cm - 127cm\n\n\n\n\n\n\n素材\n\nDCH50, Dyneema Stretch Mesh UL, DCH150\n\n\n\n\n\nカラー\n\n\n\n□White\n\n ■Black\n\n\n\n\n\n備考\n\n\n※サイズ選びの参考として\n\n Sサイズ\n 身長150~165cmの女性、小柄な男性等。\n\n Mサイズ\n 身長165~170cm後半の方。	https://moonlight-gear.com/cdn/shop/files/sn_50b4e01b-bf96-41c5-90f9-afeaac1e1359_large.jpg?v=1695780746	44000	https://moonlight-gear.com/collections/topcat-backpack/products/254482040	507	13	5	0	0
332	Hyperlite Mountain Gear Summit Pack  / ハイパーライトマウンテンギア サミットパック	容量\n30L\n\n\n\n重量\nWhite : 360g\n  Black : 402g\n\n\n\n\nサイズ\nトップ円周：81.3cm\n ボトム円周：78.7cm\n 長さ (ロールしない状態)：68.6cm\n バック幅：25.4cm\n\n\n\n\n\n素材\nWhite : 50D Dyneema®/Poly hybrid\nBlack : 150D Dyneema®/Poly hybrid\n\n\n\nカラー\n□White\n■Black	https://moonlight-gear.com/cdn/shop/files/HMG-Summit-Pack-White_large.jpg?v=1643357850	33000	https://moonlight-gear.com/collections/topcat-backpack/products/103334109	360	13	5	0	0
336	Six Moon Designs  Owyhee Tarp /  シックスムーンデザインズ オワイヒータープ	定員\n2人 \n\n\n\n\nサイズ\n※下記イラスト参照\n\n\n\n\n\n重量\nタープ : 689g\n バスタブフロア : 213g\n ギアロフト : 16 g\n クローズライン : 9g\n トータル : 938g\n\n\n\n素材\nタープ : 30D Silicone Coated Nylon\n ジッパー : #3 YKK\n メッシュ : 20D No-See-Um\n\n\n\nカラー\n■Gray\n\n\n\n\n\n備考\n縫製部分のシームリングは (防水加工) されていません。\n 気になる方はユーザー自身でのメンテナンスをお願いします。\n なお、シームをする場合はSix Moon DesignsではMcMETT社のSIL NETを推奨しています。	https://moonlight-gear.com/cdn/shop/files/ss_large.jpg?v=1646816817	75900	https://moonlight-gear.com/collections/topcat-tenttarp/products/254481938	689	9	2	0	0
338	Hyperlite Mountain Gear PACK ACCESSORY STRAPS / ハイパーライトマウンテンギア パックアクセサリーストラップ	サイズ\n約91cm × 2セット\n\n\n\n重量\n55.3g\n\n\n\n\n\n素材\nナイロン\n\n\n\nカラー\n■Black\n\n\n\n\n\n\n備考\n・スノーシュー、雪板、クローズドセルなどその他のギアを取り付け可能に。\n ・HMG各バックパック対応\n ・ストラップ × 4本 (2セット)\n ・サイド リリース バックル × 4個\n ・デイジーチェーンに取り付けるためのトライグライド × 4個	https://moonlight-gear.com/cdn/shop/files/sn_cedba4b0-1ca5-4c45-8de7-7888cd06be82_large.jpg?v=1674453500	3850	https://moonlight-gear.com/collections/topcat-backpack/products/254481905	55	13	5	0	0
341	Hyperlite Mountain Gear  HEADWALL 55 /  ハイパーライトマウンテンギア ヘッドウォール 55	容量\n\n55L+7L\n\n\n\n\n\n重量\n\n1180g\n\n\n\n\n\n背面長サイズ\n\nS : 38.1cm - 43.18cm\n\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n\n\n素材\n\n\nFully Woven Dyneema (High-Abrasion Points and Bottom of Bag), DCH150 Main Body, Dyneema Stretch Mesh Pocket\n\n\n\n\n\nカラー\n\n\n\n□White\n\n\n\n\n\n\n備考\n\nフレーム付き	https://moonlight-gear.com/cdn/shop/files/sn_6700e8c4-1f05-4d01-822e-cefc446f63cd_large.jpg?v=1680748230	74800	https://moonlight-gear.com/collections/topcat-backpack/products/254481921	1180	13	5	0	0
345	Hyperlite Mountain Gear CAMERA POD /  ハイパーライトマウンテンギア  カメラポッド	サイズ\nRegular : 17.8cm x 14cm x 9.5cm\n Large : 24cm x 16.5cm x 10.8cm\n\n\n\n対応サイズ\n  Regular : ソニーα6000シリーズのような小型のミラーレスカメラに適合するように設計されています。\n Large : Sony a7iii、Nikon Z6、CanonEOSRなどの大型ミラーレスカメラに適合するように設計されています。\n    ※レンズサイズによっては適合しない場合があります。\n\n\n\n重量\nRegular : 77g\n Large : 106g\n\n\n\n素材\nDyneema® Composite Fabrics (DCH150 + DCF8)\n\n\n\n備考\nMade in Mexico	https://moonlight-gear.com/cdn/shop/files/ss2_c734af04-28d1-448e-b767-bd511b2e8718_large.jpg?v=1666939723	23650	https://moonlight-gear.com/collections/topcat-backpack/products/254481762	77	13	5	0	0
347	Hyperlite Mountain Gear 2400 Southwest / ハイパーライトマウンテンギア 2400 サウスウエスト	容量\n\n40L\n\n\n重量\nS : 870g\n M : 892g\n\n\n背面長サイズ\nS : 38.1cm - 43.18cm\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n素材\nボディ : 150D Dyneema®/Poly hybrid (■Black)\n 50D Dyneema®/Poly hybrid (□White)\n ボトム : Double reinforced 150D Dyneema®/Poly hybrid\n ポケット : Dyneema® Hardline\n\n\nカラー\n■Black\n □White\n\n\n\n備考\nフレーム付き	https://moonlight-gear.com/cdn/shop/files/2400sw_black_01_large.jpg?v=1643352885	66000	https://moonlight-gear.com/collections/topcat-backpack/products/103312224	870	13	5	0	0
350	Hyperlite Mountain Gear  2400 Ice Pack /  ハイパーライトマウンテンギア 2400 アイスパック	容量\n\n40L\n\n\n重量\nS : 817g\n M : 823g\n\n\n背面長サイズ\n  S : 38.1cm - 43.18cm\n M : 43.18cm - 48.26cm\n    →︎背面長の測り方\n\n\n素材\nボディ : 50D Dyneema®/Poly hybrid\n ボトム : Double reinforced 150D Dyneema®/Poly hybrid\n クランポンパッチ : Dyneema® Hardline\n\n\nカラー\n□White\n\n\n備考\nフレーム付き	https://moonlight-gear.com/cdn/shop/files/top_8cc3d013-fa06-4c29-b254-0b0ea9457e5c_large.jpg?v=1643352399	63800	https://moonlight-gear.com/collections/topcat-backpack/products/148753721	817	13	5	0	0
353	HIGH TAIL DESIGNS × Hannah Beimborn / Watercolor Series The Ultralight Fanny Pack	容量\n1L\n\n\n\nサイズ\nW20.3cm x W17.8cm x H10.2cm x D5.1cm (四角錐台）\n\n\n\n重量\n51g\n\n\n\n素材\nSublimated 2.92 oz/sqyd Dyneema Hybrid Fabric\n #5 YKK Uretek Water-Resistant Zipper\n 3M 9485pc Dyneema Tape\n 3/4" Mil-Spec Nylon Webbing\n 3/4" Firm Nylon Grosgrain Ribbon\n 3/4" Kross Buckle\n Rubber Zipper Pull\n\n\n\nカラー\n■Lost Gulch Lookout\n\n■Red Rock Canyon\n\n■Foggy Forest\n\n■Eldorado Canyon\n\n■The Citadel\n\n■Snowy Trees\n\n■Snow Peak\n\n■Boulder Canyon\n\n■Wildflowers	https://moonlight-gear.com/cdn/shop/files/01_e4d62036-10ff-40fc-9744-03bc91c22677_large.jpg?v=1643272290	15400	https://moonlight-gear.com/collections/topcat-backpack/products/1161276174	51	3	5	0	0
333	HIGH TAIL DESIGNS / The Ultralight Fanny Packs	サイズ\nW20.3cm x W17.8cm x H10.2cm x D5.1cm (四角錐台）\n\n\n\n容量\n1L\n\n\n\n重量\n51g\n\n\n\n素材\nSublimated 2.92 oz/sqyd Dyneema Hybrid Fabric\n #5 YKK Uretek Water-Resistant Zipper\n 3M 9485pc Dyneema Tape\n 3/4" Mil-Spec Nylon Webbing\n 3/4" Firm Nylon Grosgrain Ribbon\n 3/4" Kross Buckle\n Rubber Zipper Pull\n\n\n\nカラー\n■Rusty Mint\n\n■Tombstone\n\n■Canary Seafoam\n\n■Monochrome Dusk\n\n■Pastel\n\n■Canyonlands\n\n■Park\n\n■Low Poly\n\n■Dirty Avocado\n\n■Plain\n\n■Floral\n\n■For The Birds\n ※昇華型印刷の為、多少色が異なる場合がございます。	https://moonlight-gear.com/cdn/shop/files/01_e561cf3c-e8a0-4743-9c8c-fe60d4de6773_large.jpg?v=1643150828	14300	https://moonlight-gear.com/collections/topcat-backpack/products/151918746	51	3	5	0	0
335	Hyperlite Mountain Gear Summit Stuff Pocket /  ハイパーライトマウンテンギア  サミットスタッフポケット	容量\n7.2L\n  \n\n\nサイズ\nW17.8cm x H35.6cm\n\n\n\n重量\n94g\n\n\n\n素材\n\n    DCH50 + Mesh\n\n\n\n\nカラー\n□White	https://moonlight-gear.com/cdn/shop/files/ss_e9fb0780-b69c-4732-bebf-0bb1716aff84_large.jpg?v=1654848419	9460	https://moonlight-gear.com/collections/topcat-backpack/products/254481798	94	13	5	0	0
339	Hyperlite Mountain Gear G.O.A.T TOTE /  ハイパーライトマウンテンギア  G.O.A.T トート	容量\n20L / 30L / 70L\n\n\n\n\nサイズ\n20L : 36cm x 36cm x 20cm\n 30L : 43cm x 46cm x 18cm\n 70L : 34.9cm x 55.25cm x 36.8cm\n\n\n\n\n重量\n20L : 193g\n 30L : 261g\n 70L : 343g \n\n\n\n素材\n本体 : DCH150 (White + Black)\n インナージップポケット : DCH50 (White)\n\n\nカラー\n□White\n ■Black\n\n\n\n\n備考\nMade in Mexico	https://moonlight-gear.com/cdn/shop/files/ss2_79a3501d-dd1c-448e-867d-b6046d75ca65_large.jpg?v=1666952146	23100	https://moonlight-gear.com/collections/topcat-backpack/products/254481761	20	13	5	0	0
348	Hyperlite Mountain Gear Daybreak / ハイパーライトマウンテンギア デイブレイク	容量\n本体 : 17L\n 外部ボリューム : 6L\n\n\n\n重量\n577g\n\n\n\nサイズ\n長さ：53.3cm\n ボトム幅：27.9cm\n 奥行き：16.5cm \n\n\n\n\n素材\n150D Dyneema®/Poly hybrid\n\n\n\nカラー\n□White\n ■Black	https://moonlight-gear.com/cdn/shop/files/ss_53a6460a-28d2-4028-8f78-4be584882805_large.jpg?v=1657615597	41800	https://moonlight-gear.com/collections/topcat-backpack/products/103313497	577	13	5	0	0
351	Mountain Laurel Designs  /  PROPHET 48L	容量\nTOTAL：48L\n メインパックボリューム：32L\n メイン外側ポケット： 5L\n サイドポケット： 2.5L + 2.5L\n エクステンションカラー : 6L\n\n\n\n重量\n495g\n ※バンジーコードとチェストストラップは基本重量に含まれていません。\n\n\n\n\n背面長サイズ\nX-SMALL：43cm (Fit : 152cm – 157cm)\n SMALL：46cm (Fit : 157cm – 168cm)\n MEDIUM：51cm (Fit : 168cm – 178cm)\n\n→︎背面長の測り方\n\n\n\n\n\n素材\nDyneema X Fabric : 210D Coated Nylon Ripstop\n\n\n\nカラー\n■Gray\n\n\n\n\n備考\nチェストストラップ、バンジーコード付属\n\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。  ご注文前にあらかじめご了承下さい。	https://moonlight-gear.com/cdn/shop/files/ss_be405c6a-bcc6-4c94-877f-755b4cdb7a26_large.jpg?v=1665450203	52800	https://moonlight-gear.com/collections/topcat-backpack/products/125902727	495	6	5	0	0
354	Mountain Laurel Designs  /  BURN 38L	容量\nTOTAL：38L\n メインパックボリューム：25L\n メイン外側ポケット： 3L\n サイドポケット： 2.5L + 2.5L\n エクステンションカラー： 5L\n\n\n\n\n重量\n467g\n ※バンジーコードとチェストストラップは基本重量に含まれていません。\n\n\n\n\n背面長サイズ\nX-SMALL：43 cm (Fit : 152 cm – 157 cm)\n SMALL：46 cm (Fit : 157 cm – 168 cm)\n MEDIUM：51 cm (Fit : 168 cm – 178 cm)\n\n→︎背面長の測り方\n\n\n\n\n素材\nDyneema X Fabric : 210D Coated Nylon Ripstop\n\n\n\nカラー\n■Gray\n\n■Wasabi Green\n\n\n\n\n備考\nチェストストラップ、バンジーコード付属\n\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。\n\nご注文前にあらかじめご了承下さい。	https://moonlight-gear.com/cdn/shop/files/ss_b0e0e2f3-520a-44cd-a3dd-d84803518ae7_large.jpg?v=1665449943	49500	https://moonlight-gear.com/collections/topcat-backpack/products/125901971	467	6	5	0	0
334	Mountain Laurel Designs  /  PACK POCKET	容量\n0.74 L\n\n\n\n\nサイズ\n 11.5cm x 17cm x 7cm\n\n\n\n重量\n48g\n\n\n\n\n素材\nEcoPak Ultra 200\n\n\n\nカラー\n■Ecopak Gray\n\n\n\n\n\n備考\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。  ご注文前にあらかじめご了承下さい。	https://moonlight-gear.com/cdn/shop/files/sn_cadf2e1c-f624-4b7e-acbc-dfca0339617a_large.jpg?v=1718092448	4840	https://moonlight-gear.com/collections/topcat-backpack/products/125913753	48	6	5	0	0
337	Hyperlite Mountain Gear PORTER STUFF POCKET /  ハイパーライトマウンテンギア  ポータースタッフポケット	サイズ\nW25cm x H38cm\n\n\n\n重量\n111g\n\n\n\n素材\nDCH50 & Flexible Hexagonal Grid Nylon Mesh\n\n\n\n\nカラー\n□White	https://moonlight-gear.com/cdn/shop/files/ss_6173bcee-8356-46a9-ad1e-9af855d65473_large.jpg?v=1643363290	11660	https://moonlight-gear.com/collections/topcat-backpack/products/163236822	111	13	5	0	0
340	Hyperlite Mountain Gear SHOULDER POCKET /  ハイパーライトマウンテンギア  ショルダーポケット	重量\n40g\n\n\n\nサイズ\n17.8cm x 8.9cm x 3.2cm\n\n\n\n素材\n外装 : DCH50 + UL Dyneema Stretch Mesh\n      内装 : DCF11\n\n\n\n\nカラー\n■Black	https://moonlight-gear.com/cdn/shop/files/sn1_58b69949-9418-40d0-a2ae-8da678b744bc_large.jpg?v=1719395523	9900	https://moonlight-gear.com/collections/topcat-backpack/products/254481948	40	13	5	0	0
343	Hyperlite Mountain Gear STUFF PACK / ハイパーライトマウンテンギア スタッフパック	容量\n30L\n  \n\n\n重量\n125g\n  \n\n\n  サイズ\nトップ円周：81.28cm\n  ボトム円周：78.74cm\n  長さ (ロールしない状態)：68.58cm\n    バック幅：25.4cm\n  \n\n\n  素材\nDCF11 Dyneema® Composite Fabrics (formerly Cuben Fiber)\n  \n\n\n\n  カラー\n■Black	https://moonlight-gear.com/cdn/shop/files/stuffpack_01_large.jpg?v=1643364315	25300	https://moonlight-gear.com/collections/topcat-backpack/products/104156026	125	13	5	0	0
346	Hyperlite Mountain Gear VERSA /  ハイパーライトマウンテンギア  バーサ	サイズ\n5.7cm x 15.2cm x 22.9cm\n\n\n\n\n重量\n82g\n\n\n\n素材\nDCH50 + Mesh\n\n\n\nカラー\n□White\n    ■Black\n\n\n\n備考\nMade in Mexico	https://moonlight-gear.com/cdn/shop/files/ss2_66a0fb7c-68ed-42c3-9ac1-38a364c79eb9_large.jpg?v=1657615700	15180	https://moonlight-gear.com/collections/topcat-backpack/products/254481763	82	13	5	0	0
349	Hyperlite Mountain Gear  THE BOTTLE POCKET /  ハイパーライトマウンテンギア ボトルポケット	サイズ\n高さ20.3cm × 幅7.6cm\n円周 : 27.9cm\n\n\n\n重量\n34.5g\n\n\n\n\n\n素材\nDCH50, durable stretch mesh, and 1/8" high density foam\n\n\n\nカラー\n■Black	https://moonlight-gear.com/cdn/shop/files/sn_215842d5-c185-4d65-b62c-65eb87f4eb6c_large.jpg?v=1681185485	7810	https://moonlight-gear.com/collections/topcat-backpack/products/254481929	34	13	5	0	0
352	Hyperlite Mountain Gear  3400 PORTER  /  ハイパーライトマウンテンギア 3400 ポーター	容量\n\n55L\n\n\n\n\n\n重量\n\nWhite : 952.5 g\n   Black : 1088.6 g\n\n\n\n\n\n背面長サイズ\n\nS : 38.1cm - 43.18cm\n\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n\n\n素材\n\nWhite: DCH50 (ボディ) & DCH150 (ボトム)\nBlack: DCH150\n\n\n\n\n\n\nカラー\n\n\n\n□White\n■Black\n\n\n\n\n\n備考\n\nフレーム付き	https://moonlight-gear.com/cdn/shop/files/ss_cc174f1e-c102-4ee9-8332-91f173af93cd_large.jpg?v=1666947960	68200	https://moonlight-gear.com/collections/topcat-backpack/products/1161245683	952	13	5	0	0
355	Hyperlite Mountain Gear PODS  /  ハイパーライトマウンテンギア ポッズ	サイズ\nSmall : 6.8L\n Large : 10L\n\n\n\n重量\nSmall : 34g\n Large : 37g\n\n\n\n素材\nDCF11\n\n\n\n\nカラー\n■Black	https://moonlight-gear.com/cdn/shop/files/ss_ee66d35b-aa94-48a1-87a4-b9a4ea35499e_large.jpg?v=1649933456	11770	https://moonlight-gear.com/collections/topcat-backpack/products/145984196	34	13	5	0	0
358	HIGH TAIL DESIGNS / The Ultralight Fanny Packs v1.5	サイズ\nW24cm x W21cm x H13cm x D7cm (四角錐台）\n\n\n\n容量\n2L\n\n\n\n重量\n63g\n\n\n\n素材\nSublimated 2.92 oz/sqyd Dyneema Hybrid Fabric\n         #5 YKK (or similar; HHH, Korean) Uretek Water-Resistant Zipper\n         3M 9471LSE Dyneema Tape\n         3/4" Mil-Spec Nylon Webbing\n         3/4" Firm Nylon Grosgrain Ribbon\n         3/4" Apex Buckle\n         3/4" Strap Keeper\n\n\n\n\n\nカラー\n■Old Bone\n\n  ■Jade Cream\n\n  ■Light Cobalt\n\n  ■Lilac\n\n  ■Dark Pewter\n\n■Cloudy Skies\n\n  ■Bright Lemon\n\n■Bubblegum\n\n  ■Vibrant Pumpkin\n\n■Plain \n  ※昇華型印刷の為、多少色が異なる場合がございます。	https://moonlight-gear.com/cdn/shop/files/ss2_b4ea91c9-42f4-4bcf-a690-f300278b194a_large.jpg?v=1661521103	16940	https://moonlight-gear.com/collections/topcat-backpack/products/254481827	63	3	5	0	0
361	ENLIGHTENED EQUIPMENT / Revelation 850 20°F Down Ver	サイズ\n\n全長 : 192cm\n 肩周り : 137cm\n 脚周り : 101cm\n\n\n\n重量\n639g(+/- 10g) ダウン量456g\n\n\n\n対応温度\n-6 ℃\n\n\n\n素材\n表地 : 10D Ultralight nylon\n 中綿 : 850Fill Power Down\n\n\nカラー\n■Forest/Charcoal \n    ■Navy/Charcoal \n\n\n\n\n付属品\n・ Silnylon Stuff Sack (.3oz-.8oz)\n ・ 100% Organic Cotton Storage Bag made by Freeset\n ・ Elastic Straps x2 (0.4oz each - One Straight, One Loop)	https://moonlight-gear.com/cdn/shop/files/ENLIGHTENED-EQUIPMENT---Revelation-850-20_F-Down-Ve_large.jpg?v=1643167674	70400	https://moonlight-gear.com/collections/topcat-sleeping/products/162702784	639	22	1	0	0
364	Six Moon Designs Skyscape - Trekker / シックスムーンデザインズ スカイスケイプトレッカー	定員\n1人\n\n\n\n重量\n740g\n\n\n\nサイズ\n※下記イラスト参照\n パッキングサイズ : 28cm x 11cm\n\n\n\n素材\nCanopy : 20D Silicone Coated Polyester\n Floor : 40D Silicone Coated Polyester\n Netting : 20D No-See-Um\n Zipper : #3 YKK\n\n\n\n\n\nカラー\n■Green\n\n\n\n備考\nスタッフサック、ガイライン付属。\n 縫製部分のシームリングは (防水加工) されていません。\n 気になる方はユーザー自身でのメンテナンスをお願いします。\n なお、シームをする場合はSix Moon DesignsではMcMETT社のSIL NETを推奨しています。	https://moonlight-gear.com/cdn/shop/files/sixmoon_skyscape_trekker_large.jpg?v=1643066277	73700	https://moonlight-gear.com/collections/topcat-tenttarp/products/41571451	740	9	2	0	0
356	Hyperlite Mountain Gear FLAT TARP 8.6" x 8.6" /  ハイパーライトマウンテンギア フラットタープ 8.6" x 8.6"	サイズ\n展開時 : 259.1cm x 259.1cm\n 収納時 : 16.5cm x 14cm x 8.9cm\n\n\n\n重量\n本体 のみ: 255g ガイライン : 25g×2  スタッフサック : 10g\n\n\n\n素材\nDCF8\n\n\n\n付属品\nUHMWPE Core Guy Lines 2.8mm x 10本\n Medium Drawstring Stuff Sack\n\n\n\nカラー\n□White\n\n\n\n\n備考\nMADE IN MAINE, USA	https://moonlight-gear.com/cdn/shop/files/01_fd426c05-f583-4dec-b782-5195da0d1119_large.jpg?v=1643358048	79200	https://moonlight-gear.com/collections/topcat-tenttarp/products/159882916	255	13	2	0	0
359	Mountain Laurel Designs  /  SUPERTARP FLAT TARP	定員\n2-3人\n\n\n\n\nサイズ\n3m x 3m\n\n\n\n重量\n570g (本体のみ)\n\n\n\n素材\n20D Pro Silnylon\n\n\n\nカラー\n■Green\n\n\n\n\n\n付属品\nシーム材、ガイライン、スタッフサック\n\n\n\n備考\n\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。  ご注文前にあらかじめご了承下さい。	https://moonlight-gear.com/cdn/shop/files/ss_05f51546-b82d-492d-8d47-9bc1c53bcf07_large.jpg?v=1666354369	53900	https://moonlight-gear.com/collections/topcat-tenttarp/products/254481844	570	6	2	0	0
363	OMM DuoMat / OMM デュオマット	サイズ\n45cm × 80cm\n\n\n\n重量\n135g\n\n\n\n\nカラー\n■Black\n\n\n\n備考\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。	https://moonlight-gear.com/cdn/shop/files/OMM-duomat_large.jpg?v=1643241829	4730	https://moonlight-gear.com/collections/topcat-sleeping/products/57598489	135	29	1	0	0
365	CUMULUS X-LITE 200 / キュムラス Xライト200	サイズ\n\n最大ユーザー身長 :185cm\n 長さ : 180cm\n 肩周り幅 : 77cm\n 足周り幅 : 51cm\n\n\n使用温度域\n快適使用温度 : 4℃(上下肌着のみ着用として)\n 限界使用温度 : 0℃\n\n\n重量\n本体重量 : 350g(±５%)\n 封入ダウン量 : 200 g\n\n\n素材\nFill : 900 Fill Power ethically sourced Polish goose down\n Shell and liner : Toray® Airtastic 19 g/m², 7-denier ripstop, DWR finish (100% nylon)\n\n\n\nカラー\n\n■Sun burn Toray\n\n\n備考\nスタッフサック、ストレージサック付属	https://moonlight-gear.com/cdn/shop/files/sn_1a3052da-2c07-4089-9744-0286069acbe6_large.jpg?v=1713404198	68200	https://moonlight-gear.com/collections/topcat-sleeping/products/134640265	350	27	1	0	0
369	CUMULUS MAGIC 100 / キュムラス マジック 100	サイズ\n\n 最大ユーザー身長 : 185cm\n \n長さ : 182cm\n 肩周り幅 : 75cm\n 足周り幅 : 47cm \n\n\n使用温度域\n快適使用温度 : 13℃ (上下肌着のみ着用として)\n 限界使用温度 : 10℃\n\n\n重量\n本体重量 : 215g(±５%)\n \n封入ダウン量 : 105 g\n\n\n素材\nShell and liner : Toray® Airtastic 19 g/m², 7-denier ripstop, DWR finish (100% nylon)\n \nFill : 900 Fill Power ethically sourced Polish goose down\n\n\n\nカラー\n\n■Olive\n\n\n備考\nスタッフサック付属	https://moonlight-gear.com/cdn/shop/files/sn_1d1b73d7-bcb8-4ac0-a119-e311e6347ac0_large.jpg?v=1713412685	41800	https://moonlight-gear.com/collections/topcat-sleeping/products/90845354	215	27	1	0	0
357	Hyperlite Mountain Gear 2400 PORTER / ハイパーライトマウンテンギア 2400 ポーター	容量\n\n40L\n\n\n  重量\nWhite : 861.8 g\n  Black : 952.5 g\n\n\n\n背面長サイズ\nS : 38.1cm - 43.18cm\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n素材\n□White : DCH50 (ボディ) & DCH150 (ボトム)\n  ■Black : DCH150\n\n\nカラー\n□White\n■Black\n\n\n備考\nフレーム付き	https://moonlight-gear.com/cdn/shop/files/ss_e120550b-6050-4ff5-b130-7e443385289d_large.jpg?v=1666919397	63800	https://moonlight-gear.com/collections/topcat-backpack/products/1161245673	861	13	5	0	0
360	Hyperlite Mountain Gear  UNBOUND 40 /  ハイパーライトマウンテンギア アンバウンド 40	容量\n\n本体40L+ポケット9L\n\n\n\n\n\n重量\n\n□White : 853g (Msize)\n 本体：630g\n ウエストベルト：170g\n アルミステー：50g\n ※取り外し可能\n ■Black : 914g (Msize)\n 本体：694g\n ウエストベルト：170g\n アルミステー：50g\n ※取り外し可能\n\n\n\n\n\n\n背面長サイズ\n\nS : 38.1cm - 43.18cm\n\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n\n\n\n素材\n\n\n\n□White : DCH50, DCH150, Hardline with Dyneema\n ■Black : DCH150, Hardline with Dyneema\n\n\n\n\n\nカラー\n\n\n\n□White\n\n ■Black\n\n\n\n\n\n\n\n備考\n\nフレーム付き\n\n\n※サイズ選びの参考として\n Sサイズ\n 身長150~165cmの女性、小柄な男性にフィット。\n\n Mサイズ\n 身長165~170cm後半の方。	https://moonlight-gear.com/cdn/shop/files/sn_d1f66cb2-0587-4b3b-ba7b-4430120a426e_large.jpg?v=1696213406	66000	https://moonlight-gear.com/collections/topcat-backpack/products/254481917	853	13	5	0	0
362	Hyperlite Mountain Gear  WAYPOINT 35 /  ハイパーライトマウンテンギア ウェイポイント 35	容量\n\n本体 : 35L\n外部ボリューム : 6L\n\n\n\n\n\n重量\n\n666g (M Size)\n\n\n\n\n\n背面長サイズ\n\nS : 38.1cm - 43.18cm\n\n M : 43.18cm - 48.26cm\n\n→︎背面長の測り方\n\n\n\n\n\n\nヒップベルトサイズ\n\n71cm - 127cm\n\n\n\n\n\n\n素材\n\n\n    DCH50, DCH150, 100D Dyneema® Gridstop, Dyneema® Stretch Mesh UL\n\n\n\n\n\nカラー\n\n\n\n□White\n\n ■Black\n\n\n\n\n\n備考\n\n\n※サイズ選びの参考として\n\n Sサイズ\n 身長150~165cmの女性、小柄な男性等。\n\n Mサイズ\n 身長165~170cm後半の方。	https://moonlight-gear.com/cdn/shop/files/sn_fa90d9b8-31e9-4b2c-b28b-796b1e7a8de8_large.jpg?v=1711708745	63800	https://moonlight-gear.com/collections/topcat-backpack/products/254482078	666	13	5	0	0
366	Mountain Laurel Designs  /  CRICKET PYRAMID TARP	定員\n2人\n\n\n\n\nサイズ\n142cm(W) x 285cm(L) x 140cm(H)\n 72cm(くちばし長)\n\n\n\n重量\n350g (本体のみ)\n\n\n\n素材\n20D Pro Silnylon\n\n\n\nカラー\n■Orange Citras\n\n\n\n付属品\nシーム材、ガイライン、スタッフサック、アルミニウムポールジャック\n\n\n\n備考\n\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。\n\nご注文前にあらかじめご了承下さい。	https://moonlight-gear.com/cdn/shop/files/ss_2c7085ec-9d81-4872-bbb1-fab035f9a881_large.jpg?v=1666138464	46200	https://moonlight-gear.com/collections/topcat-tenttarp/products/254481842	350	6	2	0	0
368	Mountain Laurel Designs / M QUILT	サイズ\n長さ：147cm\n トップ : 112cm\n ボトム : 89cm\n\n\n\n重量\n266g\n\n\n\n素材\nシェル：10D X 10D 3x DWR RipStop 0.74 oz sq/yd\n 中綿 : Climashield Apex Synthetic\n\n\n\nカラー\n■Black/Green\n\n\n\n\n備考\nスタッフサック付属\n MADE IN USA\n\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。  ご注文前にあらかじめご了承下さい。	https://moonlight-gear.com/cdn/shop/files/sn_78b98ad5-0427-48ae-bcd8-6063cfa75e0d_large.jpg?v=1699932763	41800	https://moonlight-gear.com/collections/topcat-sleeping/products/129999435	266	6	1	0	0
367	Mountain Laurel Designs / TRAILSTAR	TRAILSTAR\n \n\n\n定員\n1人〜3人\n\n\n\nサイズ\nパネル長辺 : 221cm\n 高さ : 115-130cm (ピッチの高さによって異なります)\n\n\n\n重量\n510g\n\n\n素材\nPro Silnylon\n\n\nカラー\n\n■GRAY GREEN\n\n\n\n\n付属品\nシーム材、ガイライン、スタッフサック\n\n\n\n備考\n\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。  ご注文前にあらかじめご了承下さい。 \n\n\n\n\n\n\n\nTRAILSTAR INNERNET ™\n\n \n\n\n\n定員\n1人〜2人\n\n\n\nサイズ\n下記イラスト参照\n\n\n\n重量\n369g\n\n\n素材\nボトム : Pro Silnylon\n メッシュ : 7 Nanoseeum ® bug net\n\n\nカラー\n\n■ORANGE	https://moonlight-gear.com/cdn/shop/files/MLD-TRAILSTAR_large.jpg?v=1643345568	44000	https://moonlight-gear.com/collections/topcat-tenttarp/products/126557165	510369	6	2	0	0
370	ENLIGHTENED EQUIPMENT / Torrid Booties	サイズ\n\nSmall : 22.5-24cm\n Medium : 25-26.5cm\n Large : 26.5-27cm\n\n\n\n重量\n60g (Medium) 実測値\n\n\n\n素材\n表地 : 10D ripstop nylon\n 中綿 : 4oz/yd² CLIMASHIELD™ APEX\n\n\nカラー\n■Black/Chacoal\n\n\n\n\n備考\nHandmade in Winona, Minnesota	https://moonlight-gear.com/cdn/shop/files/ENLIGHTENED-EQUIPMENT---Torrid-Booties_large.jpg?v=1643172801	14850	https://moonlight-gear.com/collections/topcat-sleeping/products/1169159760	60	22	1	0	0
415	Six Moon Designs Haven Tarp / シックスムーンデザインズ ヘイブンタープ	定員\n2人\n\n\n\nサイズ\n※下記イラスト参照\n\n\n\n重量\n500g\n\n\n\n素材\nフライ：20D Silicon Nylon\n ジッパー ： #3 YKK\n\n\n\n\nセット内容\nタープ、スタッフサック、ガイライン\n\n\n\nカラー\n■Gray\n\n■Green\n\n\n\n備考\n1. 設営には可変式のトレッキングポール Six Moon Designs純正のテントポールをお使いください。\n 2. 縫製部分のシームリングは（防水加工）されていません。\n 気になる方はユーザー自身でのメンテナンスをお願いします。\n なお、シームをする場合はSix Moon DesignsではMcNETT社のSIL NETを推奨しています。	https://moonlight-gear.com/cdn/shop/files/sixmoon_heaven_tarp_large.jpg?v=1653653962	60500	https://moonlight-gear.com/collections/topcat-tenttarp/products/22661373	500	9	2	0	0
407	CUMULUS PANYAM 600 / キュムラス パンヤム 600	サイズ\n\n最大ユーザー身長 : 190cm\n 長さ : 208cm\n 肩周り幅 : 80cm\n 足周り幅 : 55cm\n スタッフサック：高さ29cm×直径19cm\n\n\n\n使用温度域\n適正使用温度 : -13℃\n \n限界使用温度 : -32℃\n\n\n\n重量\n本体重量 : 970g(±5%)\n \n封入ダウン量 : 600g\n\n\n\n素材\nPertex Quantum, 29g/m²\n 850 Fill Power Goose Down\n\n\n\nカラー\n\n■Orange\n\n\n備考\nスタッフサック、ストレージサック付属	https://moonlight-gear.com/cdn/shop/files/CUMULUS-PANYAM-600_large.jpg?v=1643161056	74800	https://moonlight-gear.com/collections/topcat-sleeping/products/83745487	970	27	1	0	0
409	OMM Mountain Raid 160 / OMM マウンテンレイド 160	サイズ\nRegular : 全長195cm×肩周り幅65cm×足元35cm\n X-Large : 全長210cm×肩周り幅75cm×足元35cm\n 収納サイズ : 22cm x 15 cm\n\n\n\n重量\n450g\n\n\n\n\n\n素材\nシェル：PointZero Fabric\n 中綿：PrimaLoft® Gold Insulation with Cross Core : 100g (表面) 60g (背面）\n\n\n\nカラー\n■Blue\n\n\n\n\n備考\n・快適使用温度 (comfort) 9℃\n ・使用可能下限温度 (extreme) -3℃\n\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。	https://moonlight-gear.com/cdn/shop/files/OMM--Mountain-Raid-160_large.jpg?v=1643252206	45100	https://moonlight-gear.com/collections/topcat-sleeping/products/254481952	450	29	1	0	0
413	Mountain Laurel Designs / FKT E-VENT BIVY	サイズ\n全長 : 190cm\n 開口部 (最長部) : 75 cm (周囲 182 cm)\n ボトム幅 (最短部) : 60 cm (周囲 140cm)\n\n\n\n重量\n280g\n\n\n\n素材\nアッパー : 10D 3-layer eVENT\n フロア：1.35oz 20d Pro SilNyon WP. +3,500mm\n ジッパー : #3 YKK water-resistant zipper \n\n\n\n透湿性\n30.000mmg/m2/24h\n\n\n\n\nカラー\n■Black/■Gray Green\n\n\n\n\n付属品\nスタッフサック、シーム材付属\n ※シームリング材で目止め処理をすると防水性能が上がります。\n\n\n\n\n備考\n\n※このブランドはすべての製品をハンドメイドで制作。プラスチックパーツの形状やカラー変更、ストラップの締め方の変更など細かな仕様変更がある場合があります。  ご注文前にあらかじめご了承下さい。	https://moonlight-gear.com/cdn/shop/files/sn_cfdf427e-2561-4e76-8490-13d135659788_large.jpg?v=1718239313	58300	https://moonlight-gear.com/collections/topcat-sleeping/products/151716817	280	6	1	0	0
404	OMM Core Liner / OMM コアライナー	サイズ\n全長190cm × 肩幅65cm\n スタッフサック収納時：16cm × 11cm\n\n\n\n重量\n175g\n\n\n\n\n素材\nPRIMALOFT® ACTIVE 75g\n\n\n\n\n\nカラー\n■Orange\n\n\n\n\n備考\n・スタッフサック付属\n\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。	https://moonlight-gear.com/cdn/shop/files/OMM-Core-Liner_large.jpg?v=1643244988	24200	https://moonlight-gear.com/collections/topcat-sleeping/products/155025576	175	29	1	0	0
406	OMM Mountain Core 250 / OMM マウンテンコア 250	サイズ\n全長195cm × 肩幅65cm\n 収納サイズ : 27cm x 16cm\n\n\n\n重量\n700g\n\n\n\n\n\n素材\nシェル：PointZero® – 22g/㎡ 100%リップストップナイロン\n 中綿：PRIMALOFT® ACTIVE 250g\n\n\n\nカラー\n■Navy\n\n\n\n断熱性能\n2.0 TOG （乾燥状態）\n 1.4 TOG （濡れた状態）\n\n\n\n\n備考\n\n・100%リサイクルインサレーション\n ・スタッフサック付属\n\n\n※OMMは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n 通信販売をお求めの方は\n→OMM JAPAN公式サイト よりお買い求めください。	https://moonlight-gear.com/cdn/shop/files/sn_bc25d914-ce98-4dfd-9e45-a3715503cac7_large.jpg?v=1669620343	48950	https://moonlight-gear.com/collections/topcat-sleeping/products/254481884	700	29	1	0	0
412	CUMULUS X-LITE 300 / キュムラス Xライト300	サイズ\n\n最大ユーザー身長 :185cm\n 長さ : 202cm\n 肩周り幅 : 77cm\n 足周り幅 : 51cm\n\n\n使用温度域\n快適使用温度 : 2℃ (上下肌着のみ着用として)\n 快適限界使用温度 : -4℃\n エクストリームリミット : -20℃\n\n\n重量\n本体重量 : 465g(±5%)\n 封入ダウン量 : 300 g\n\n\n素材\nFill : 900 Fill Power ethically sourced Polish goose down\n Shell and liner : Toray® Airtastic 19 g/m², 7-denier ripstop, DWR finish (100% nylon)\n\n\n\nカラー\n\n■Fall leaf Toray\n\n\n備考\nスタッフサック、ストレージサック付属	https://moonlight-gear.com/cdn/shop/files/sn_e2b67852-482d-48a0-b0a7-6998cd0a9008_large.jpg?v=1713403860	79200	https://moonlight-gear.com/collections/topcat-sleeping/products/137891122	465	27	1	0	0
461	HOUDINI All Weather T-Neck /  フーディニ オールウェザーTネック	サイズ\n前着丈(cm)\n身幅(cm)\n裾幅(cm)\n袖丈(cm)\nS (W's M)\n62\n116\n113\n28\nM (W's L)\n64\n122\n119\n29\nL (W's XL)\n66\n128\n125\n30\n\n\n\n\n\n\n重量\n340g\n\n\n\n素材\nFace fabric C9 Ripstop™ Lining: Lite Breather Padding: Primaloft Gold Active + Face fabric: 100% recycled polyester\n Lining: 100% recycled polyester\n Padding: 55% recycled polyester 45% Polyester\n\n\n\nカラー\n  ■True Black\n\n    ■Geyser Grey\n\n  ■Sandstorm\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nMサイズ\n （172cm/62kg 中肉中背）ゆったりフィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn2_1219f50a-07b3-47bd-8027-33fc0f0f0431_large.jpg?v=1708931843	30800	https://moonlight-gear.com/collections/cat-topsinsulation/products/164514588	340	65	16	0	0
462	Norrona falketind Octa Jacket / ノローナ フォルケティンオクタジャケット	重量\nS : 245g\n M : 266g\n\n\n\n素材\nPERTEX® 51% RECYCLED NYLON / 49% NYLON\n\n\n\nカラー\n  ■Indigo Night\n\n■Olive Night\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n Mサイズ\n（172cm/62kg 中肉中背）ゆったり目のフィット\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_46363267-5391-4a52-9315-b1c230691433_large.jpg?v=1696898624	30800	https://moonlight-gear.com/collections/cat-topsinsulation/products/154522480	266	66	16	0	0
463	Norrona lyngen Alpha100 Zip Hood (M) / ノローナ リンゲンアルファ100ジップフード	重量\n380g\n  \n\n\n素材\n20D 100% recycled nylon\n 78% recycled polyester, 22% polyester\n\n\n\nカラー\n■Indigo Night\n\n■Olive Night\n  \n\n特徴\n・撥水加工：PFC Free DWR\n ・片手で調節可能なクライミングヘルメット用ストームフード\n ・裾はバンジーコードにより調整可能	https://moonlight-gear.com/cdn/shop/files/sn_486ea285-9dfd-45a8-8613-f34b4e472a02_large.jpg?v=1702528512	48400	https://moonlight-gear.com/collections/cat-topsinsulation/products/254481887	380	66	16	0	0
464	Norrona falketind Alpha120 Zip Hood (M) / ノローナ フォルケティンアルファ120ジップフード	重量\n280g\n\n\n\n素材\n63% RECYCLED POLYESTER, 37% POLYESTER / 49% RECYCLED POLYESTER, 48% POLYESTER, 3% ELASTANE\n\n\n\nカラー\n■Caviar\n\n  ■Olive Night \n\n特徴\n肩下から脇下、腕下に伸縮性の高いPolartec® Power Gridを採用	https://moonlight-gear.com/cdn/shop/files/sn_157891b1-aebd-4e35-8e74-2ce9ae77c80c_large.jpg?v=1669861453	29700	https://moonlight-gear.com/collections/cat-topsinsulation/products/254481888	280	66	16	0	0
465	STATIC ADRIFT HALF ZIP HOODY / スタティック アドリフトハーフジップフーディ	重量\n140g (Mサイズ)\n\n\n\n素材\nOcta®CPCP®ポリエステル100％(内リサイクルポリエステル53％)\n\n\n\nカラー\n\n■Black\n\n■Touchwood\n\n\n\n備考\n・柔軟剤、漂白剤は使えません。\n ・手洗いまたは、洗濯ネットに入れておしゃれ着洗いや手洗いモードにて回してください。\n ・乾燥機、ドライクリーニングは不可。\n ・尖ったものの引っ掛けには弱い生地ですので藪漕ぎ時には注意ください。\n\n\n\n\n\n※サイズ選びの参考として\n\n\nMサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nLサイズ\n（172cm/62kg 中肉中背）ゆったり目のフィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_38a4b08c-f977-4c59-84f6-23c2b896a3e9_large.jpg?v=1698729153	18700	https://moonlight-gear.com/collections/cat-topsinsulation/products/254482053	140	67	16	0	0
466	CUMULUS PRIMELITE PULLOVER / キュムラス プライムライト プルオーバー	素材\n表地：Pertex® Quantum 22 g/m², 7D ripstop, DWR finish (100% nylon) \n  中綿：850 Fill Power ethically sourced Polish goose down\n\n\nカラー\n ■Meteorite Black (Black ZIP Edition)\n\n\n備考\nスタッフサック付属 14cm×9cm\n\n\n\n\n※サイズ選びの参考として\n\n\n\nSサイズ\n（172cm/62kg 中肉中背）レギュラーフィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_81c0621e-c8c9-42e0-b4e8-295edab0687a_large.jpg?v=1713414916	42900	https://moonlight-gear.com/collections/cat-topsinsulation/products/154481752	190	27	16	0	0
467	PA'LANTE grid fleece hoody /  パランテ グリッドフリースフーディ	素材\nポリエステル100％\n\n\n\nカラー\n\n■Blue\n\n■Chartreuse\n\n\n\n備考\n※PA'LANTEは全商品MLG東京、MLG大阪、MLG福岡の実店舗のみでの販売となります。\n通信販売をお求めの方は →PA'LANTE JAPAN公式サイト よりお買い求めください。\n\n\n\n\n\n\n※サイズ選びの参考として\n\n\nSサイズ\n （172cm/62kg 中肉中背）ジャストフィット\n\n\nMサイズ\n（172cm/62kg 中肉中背）ゆったり目のフィット\n\n\n※サイズ感はあくまで目安となります。\n ※実際の着衣長は下図とサイズ表を参考にしてください。\n ※より詳細なサイズ感を知りたい方は、メール、TELにてお気軽にお問い合わせください。	https://moonlight-gear.com/cdn/shop/files/sn_8b3ca049-423b-4bd5-bac6-1db53eb51dc3_large.jpg?v=1670803680	24200	https://moonlight-gear.com/collections/cat-topsinsulation/products/254481896	289	68	16	0	0
\.


--
-- Data for Name: PackingList; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."PackingList" (id, "userId", "gearId", "createdAt", name, "tripId", "updatedAt") FROM stdin;
61	cm0icvzm200001colna77gyde	301	2024-09-06 16:36:46.224		\N	2024-09-11 15:31:09.624
67	cm0icvzm200001colna77gyde	421	2024-09-07 00:30:29.726		\N	2024-09-11 15:31:09.624
68	cm0icvzm200001colna77gyde	\N	2024-09-07 05:52:02.394		\N	2024-09-11 15:31:09.624
69	cm0icvzm200001colna77gyde	\N	2024-09-07 05:54:24.911		\N	2024-09-11 15:31:09.624
71	cm0icvzm200001colna77gyde	422	2024-09-07 10:35:30.788		\N	2024-09-11 15:31:09.624
72	cm0icvzm200001colna77gyde	432	2024-09-07 10:36:02.752		\N	2024-09-11 15:31:09.624
73	cm0icvzm200001colna77gyde	425	2024-09-07 10:36:15.082		\N	2024-09-11 15:31:09.624
74	cm0icvzm200001colna77gyde	426	2024-09-07 10:36:41.208		\N	2024-09-11 15:31:09.624
75	cm0icvzm200001colna77gyde	\N	2024-09-07 10:37:38.67		\N	2024-09-11 15:31:09.624
91	cm0icvzm200001colna77gyde	262	2024-09-07 18:35:32.714		\N	2024-09-11 15:31:09.624
95	cm0icvzm200001colna77gyde	417	2024-09-07 18:41:58.364		\N	2024-09-11 15:31:09.624
98	cm0icvzm200001colna77gyde	455	2024-09-07 20:23:57.306		\N	2024-09-11 15:31:09.624
106	cm0icvzm200001colna77gyde	458	2024-09-08 02:57:51.87		\N	2024-09-11 15:31:09.624
107	cm0icvzm200001colna77gyde	316	2024-09-08 02:58:15.244		\N	2024-09-11 15:31:09.624
108	cm0icvzm200001colna77gyde	\N	2024-09-08 02:58:32.506		\N	2024-09-11 15:31:09.624
109	cm0icvzm200001colna77gyde	\N	2024-09-08 03:01:07.243		\N	2024-09-11 15:31:09.624
111	cm0icvzm200001colna77gyde	469	2024-09-08 03:12:58.768		\N	2024-09-11 15:31:09.624
112	cm0icvzm200001colna77gyde	524	2024-09-08 03:13:53.859		\N	2024-09-11 15:31:09.624
115	cm0icvzm200001colna77gyde	531	2024-09-08 03:54:09.203		\N	2024-09-11 15:31:09.624
116	cm0icvzm200001colna77gyde	529	2024-09-08 03:54:18.975		\N	2024-09-11 15:31:09.624
117	cm0icvzm200001colna77gyde	\N	2024-09-08 04:25:11.964		\N	2024-09-11 15:31:09.624
118	cm0icvzm200001colna77gyde	\N	2024-09-08 04:26:49.478		\N	2024-09-11 15:31:09.624
119	cm0icvzm200001colna77gyde	\N	2024-09-08 05:32:00.703		\N	2024-09-11 15:31:09.624
120	cm0icvzm200001colna77gyde	\N	2024-09-08 05:39:25.405		\N	2024-09-11 15:31:09.624
121	cm0icvzm200001colna77gyde	\N	2024-09-08 05:40:04.813		\N	2024-09-11 15:31:09.624
122	cm0icvzm200001colna77gyde	\N	2024-09-08 05:41:07.315		\N	2024-09-11 15:31:09.624
123	cm0icvzm200001colna77gyde	\N	2024-09-08 05:42:36.104		\N	2024-09-11 15:31:09.624
124	cm0icvzm200001colna77gyde	\N	2024-09-08 05:43:25.221		\N	2024-09-11 15:31:09.624
125	cm0icvzm200001colna77gyde	535	2024-09-08 05:51:21.591		\N	2024-09-11 15:31:09.624
126	cm0icvzm200001colna77gyde	\N	2024-09-08 06:07:12.673		\N	2024-09-11 15:31:09.624
127	cm0icvzm200001colna77gyde	\N	2024-09-08 06:09:08.636		\N	2024-09-11 15:31:09.624
128	cm0icvzm200001colna77gyde	536	2024-09-08 06:31:35.625		\N	2024-09-11 15:31:09.624
\.


--
-- Data for Name: PackingListItem; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."PackingListItem" (id, "packingListId", "gearId", "personalGearId", quantity) FROM stdin;
\.


--
-- Data for Name: PackingListLike; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."PackingListLike" (id, "userId", "packingListId", "createdAt") FROM stdin;
\.


--
-- Data for Name: PersonalGear; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."PersonalGear" (id, "userId", name, weight, "categoryId", img, price, "productUrl", "createdAt", "updatedAt", "brandId", "gearId") FROM stdin;
14	cm0icvzm200001colna77gyde	myog	97	5		\N		2024-09-06 14:38:06.644	2024-09-06 14:38:06.644	\N	\N
17	cm0icvzm200001colna77gyde	自作	100	5		\N		2024-09-06 15:53:47.535	2024-09-06 15:53:47.535	\N	\N
22	cm0icvzm200001colna77gyde	自作バックパック	110	5	data:image/jpeg;base64,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	20000		2024-09-06 17:22:33.436	2024-09-06 17:22:33.436	\N	\N
25	cm0icvzm200001colna77gyde	PARAPACK / パラパック P-キャップ	28	15	https://shop.moderateweb.com/cdn/shop/files/CWz6gGSwB4vKLcAd7WZvVM49Vif1YreJV2ISgVBL.jpg?v=1711603010	7920	https://www.sora-store.jp/c/002/002P/002P004/PCAP-OG	2024-09-07 04:20:25.753	2024-09-07 04:20:25.753	44	427
26	cm0icvzm200001colna77gyde	KATADYN BeFree / カタダイン ビーフリー 1.0L	63	11	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWAvDKs7RRyK3w5z93R4Trvj67XEyShKsVtfASKg8OJw&s	9020	https://store.yamap.com/products/katadyn-befree-1-0l	2024-09-07 05:54:18.356	2024-09-07 05:54:18.356	42	424
28	cm0icvzm200001colna77gyde	ONC MERINO ロングスリーブ TEE	250	3	https://onc-merino.com/cdn/shop/files/14-2.jpg?v=1712128781&width=900	16500	https://onc-merino.com/collections/23ss/products/black	2024-09-07 07:17:49.516	2024-09-07 07:17:49.516	45	429
32	cm0icvzm200001colna77gyde	Wildo fold a cup (Regular)	24	14	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkPoyXmqHAZFFc7-ptwQq-ngu0g3jFqDuQU_bJZlUAxuXkiVn1_rW3Bcdm&s=10	770	https://moonlight-gear.com/collections/cat-cutlery/products/145794302	2024-09-07 10:35:34.127	2024-09-07 10:35:34.127	40	422
33	cm0icvzm200001colna77gyde	エマージェンシーブランケット	70	8	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8wmFOapDAfVCd7YgitTLZB0YMyOWxojzGQ&usqp=CAU	700	https://www.google.com/imgres?imgurl=https%3A%2F%2Fitem-shopping.c.yimg.jp%2Fi%2Fl%2Fpasso_s-05-584&tbnid=cSxtmnW84qyKpM&vet=1&imgrefurl=https%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fpasso%2Fs-05-584.html&docid=Vkg6_Usp83fV6M&w=600&h=600&itg=1&source=sh%2Fx%2Fim%2Fm1%2F3&kgs=5b86cc1393c65b62&shem=abme%2Ctrie	2024-09-07 10:35:57.314	2024-09-07 10:35:57.314	48	432
34	cm0icvzm200001colna77gyde	PETZL BINDI / ペツル ビンディ	35	9	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROyvMvJWVEdJIWOULPRfKq1g52wYu9PvsTgSnJAq6ZeA&s	7800	https://www.petzl.co.jp/headlamp/bindi/	2024-09-07 10:36:18.751	2024-09-07 10:36:18.751	43	425
35	cm0icvzm200001colna77gyde	5-Pocket Pants	239	6	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKiAAH_nkcgPlT45BK-PG9OaA2NJiGV4RYd2n127tX65xleHE7gBqMo5-y&s=10	17500	https://www.yamatomichi.com/products/5-pocket-pants-m	2024-09-07 10:36:45.215	2024-09-07 10:36:45.215	17	426
36	cm0icvzm200001colna77gyde	Senchi Designs ALPHA 60 CREWNECK / センチデザイン アルファ60クルーネック	96	16	https://moonlight-gear.com/cdn/shop/files/sn_c6a67e45-ce11-4942-8048-9026b85a4429_large.jpg?v=1715213197	19800	https://moonlight-gear.com/collections/cat-topsinsulation/products/254482097	2024-09-07 20:24:37.152	2024-09-07 20:24:37.152	63	455
37	cm0icvzm200001colna77gyde	Senchi Designs ALPHA 60 HOODIE / センチデザイン アルファ60フーディ	116	16	https://moonlight-gear.com/cdn/shop/files/sn2_4f706e57-1349-46e6-870e-ed73cb35bc7b_large.jpg?v=1715332540	22000	https://moonlight-gear.com/collections/cat-topsinsulation/products/254482096	2024-09-07 20:25:00.19	2024-09-07 20:25:00.19	63	456
38	cm0icvzm200001colna77gyde	Batchstovez / H-20 Stove	19	17	https://moonlight-gear.com/cdn/shop/files/Batchstovez---H-20-Stove_large.jpg?v=1646193580	8250	https://moonlight-gear.com/collections/cat-stove/products/153550438	2024-09-07 20:25:58.265	2024-09-07 20:25:58.265	70	481
39	cm0icvzm200001colna77gyde	Six Moon Designs Gatewood Cape / シックスムーンデザインズ ゲイトウッドケープ	285	2	https://www.sixmoondesigns.com/cdn/shop/products/GreyAwardsGatewoodCape.jpg?v=1639176930&width=1200	42900	\N	2024-09-08 01:36:36.672	2024-09-08 01:36:36.672	9	419
40	cm0icvzm200001colna77gyde	PB Tarp 5×8	170	2	https://baseec-img-mng.akamaized.net/images/item/origin/df85e5900ffc8e90c59f16bcef886f0c.jpg?imformat=generic&q=90&im=Resize,width=640,type=normal	16500	\N	2024-09-08 01:37:20.171	2024-09-08 01:37:20.171	11	417
41	cm0icvzm200001colna77gyde	Six Moon Designs Skyscape - Trekker / シックスムーンデザインズ スカイスケイプトレッカー	740	2	https://moonlight-gear.com/cdn/shop/files/sixmoon_skyscape_trekker_large.jpg?v=1643066277	73700	https://moonlight-gear.com/collections/topcat-tenttarp/products/41571451	2024-09-08 01:38:51.163	2024-09-08 01:38:51.163	9	364
42	cm0icvzm200001colna77gyde	Hillbilly Pot 550	80	4	https://hikersdepot.jp/cdn/shop/files/hbp550tp-520x520.jpg?v=1712138429&width=500	6050	https://hikersdepot.jp/products/hillbilly-pot-550	2024-09-08 01:41:14.693	2024-09-08 01:41:14.693	11	301
44	cm0icvzm200001colna77gyde	Six Moon Designs Haven Tarp / シックスムーンデザインズ ヘイブンタープ	500	2	https://moonlight-gear.com/cdn/shop/files/sixmoon_heaven_tarp_large.jpg?v=1653653962	60500	https://moonlight-gear.com/collections/topcat-tenttarp/products/22661373	2024-09-08 02:06:30.171	2024-09-08 02:06:30.171	9	415
45	cm0icvzm200001colna77gyde	PB Tarp 5×8	170	2	https://baseec-img-mng.akamaized.net/images/item/origin/df85e5900ffc8e90c59f16bcef886f0c.jpg?imformat=generic&q=90&im=Resize,width=640,type=normal	16500	\N	2024-09-08 02:10:30.679	2024-09-08 02:10:30.679	11	417
47	cm0icvzm200001colna77gyde	燃焼用アルコール	150	17		\N		2024-09-08 03:00:45.905	2024-09-08 03:02:04.022	\N	\N
49	cm0icvzm200001colna77gyde	Zpacks Lotus UL Umbrella / Zパック ロータスウルトラライトアンブレラ	192	13	https://moonlight-gear.com/cdn/shop/files/sn_b33da74b-5297-464d-9aee-8eff017419fe_large.jpg?v=1688454731	11000	https://moonlight-gear.com/collections/cat-umbrella/products/254481995	2024-09-08 03:13:58.506	2024-09-08 03:13:58.506	60	524
50	cm0icvzm200001colna77gyde	test	55	19		\N		2024-09-08 03:38:25.082	2024-09-08 03:38:25.082	\N	\N
51	cm0icvzm200001colna77gyde	靴下	49	19		\N		2024-09-08 03:48:28.499	2024-09-08 03:48:28.499	\N	\N
52	cm0icvzm200001colna77gyde	ペグ8本	80	20		\N		2024-09-08 04:25:00.309	2024-09-08 04:25:00.309	\N	\N
53	cm0icvzm200001colna77gyde	ENLIGHTENED EQUIPMENT / Revelation 850 20°F Down Ver	639	1	https://moonlight-gear.com/cdn/shop/files/ENLIGHTENED-EQUIPMENT---Revelation-850-20_F-Down-Ve_large.jpg?v=1643167674	70400	https://moonlight-gear.com/collections/topcat-sleeping/products/162702784	2024-09-08 04:26:38.16	2024-09-08 04:26:38.16	22	361
54	cm0icvzm200001colna77gyde	STUFF PACK XL	66	10	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYdEQ74Mpzs9qAKK_Md0Zpe8oya0jmxnv_lZx9UlsNLV_foA4s9mJJGcqs&s=10	4500	https://www.yamatomichi.com/products/stuff-pack-xl	2024-09-08 05:31:47.944	2024-09-08 05:31:47.944	17	534
55	cm0icvzm200001colna77gyde	myog DCFスタッフサック	30	10		\N		2024-09-08 05:39:14.379	2024-09-08 05:39:14.379	\N	\N
56	cm0icvzm200001colna77gyde	Tritensil Spoon & Folk/Knife	20	14	https://moonlight-gear.com/cdn/shop/files/tritensil_large.jpg?v=1642990469	1210	https://moonlight-gear.com/collections/cat-cutlery/products/142224603	2024-09-08 05:39:57.073	2024-09-08 05:39:57.073	83	526
57	cm0icvzm200001colna77gyde	PowerCore 10000	180	10	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ73lDgA-s2yUtYsxEoJNAkbJyKfLf9X6maBFbxPUpgJ89bZd9NAZZu2c&s=10	2990	https://www.ankerjapan.com/products/a1263?srsltid=AfmBOopie-07Hbg0CBhhpLUa5z3Ry0m-i5ay9bub9B1u-75-82KoK0t0	2024-09-08 05:40:36.209	2024-09-08 05:40:36.209	49	433
58	cm0icvzm200001colna77gyde	MUNIEQ / X-Mesh Stove	12	17	https://moonlight-gear.com/cdn/shop/files/sn_6ca97480-106d-4530-8eae-5d70e456a1e4_large.jpg?v=1680838055	2750	https://moonlight-gear.com/collections/cat-stove/products/254481925	2024-09-08 05:40:57.561	2024-09-08 05:40:57.561	74	490
60	cm0icvzm200001colna77gyde	Mountain Laurel Designs / FKT E-VENT BIVY	280	1	https://moonlight-gear.com/cdn/shop/files/sn_cfdf427e-2561-4e76-8490-13d135659788_large.jpg?v=1718239313	58300	https://moonlight-gear.com/collections/topcat-sleeping/products/151716817	2024-09-08 05:43:13.197	2024-09-08 05:43:13.197	6	413
61	cm0icvzm200001colna77gyde	Minimalist Trekking Pole	144	7	https://zpacks.com/cdn/shop/files/Zpacks-Minimalist-Trekking-Poles-02_2048x.jpg?v=1711998173	14300	https://yosemite-store.com/?pid=178190858	2024-09-08 05:51:26.067	2024-09-08 05:51:26.067	60	535
62	cm0icvzm200001colna77gyde	手ぬぐい2枚	140	10		\N		2024-09-08 06:06:48.951	2024-09-08 06:06:48.951	\N	\N
63	cm0icvzm200001colna77gyde	ジップロック3枚	20	10		\N		2024-09-08 06:08:51.311	2024-09-08 06:08:51.311	\N	\N
64	cm0icvzm200001colna77gyde	キャリー・ザ・サン(CARRY THE SUN)	57	9	https://carrythesun.jp/cdn/shop/files/GR-Landport-ServiceSite-product-Thums-M-WL-Wbelt_2x_85090c30-167c-4d20-baa7-d665dfbbd430_1296x.jpg?v=1683961478	3300	https://amzn.asia/d/fzR1Hmr	2024-09-08 06:31:30.169	2024-09-08 06:31:30.169	86	536
65	cm0icvzm200001colna77gyde	テスト	20	11		\N		2024-09-08 09:25:31.866	2024-09-08 09:25:31.866	\N	\N
66	cm0icvzm200001colna77gyde	Six Moon Designs 5section Carbon Pole / シックスムーンデザインズ 5セクションカーボンポール	58	20	https://moonlight-gear.com/cdn/shop/files/sn_b57d998f-53c3-4113-beea-7aa8eb63a24e_large.jpg?v=1688944984	12100	https://moonlight-gear.com/collections/cat-tentacc/products/254482005	2024-09-08 09:25:54.333	2024-09-08 09:25:54.333	50	445
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Review" (id, rating, comment, "gearId", "createdAt") FROM stdin;
1	5	いつもお世話になってます	316	2024-09-01 01:19:25.955
2	4	とても軽く、初心者にもお勧めできるいいギアだと思います。\n去年からで北アルにいきましたが、快適に過ごせました。	330	2024-09-01 02:05:15.609
3	3	米を炊くのにいい大きさ	248	2024-09-01 14:22:43.987
4	5	あまり被らなくてカッコ良い	351	2024-09-01 14:23:46.733
5	5	間違いなし\n丈夫で軽い	344	2024-09-01 14:24:45.259
6	5	名品	409	2024-09-01 14:25:26.468
7	4	化繊なので蒸れにくいのがいいです	409	2024-09-01 14:27:03.656
8	5	海外ハイカー感	305	2024-09-01 14:28:21.567
9	4	着脱便利	306	2024-09-01 14:29:09.506
10	5	毎回これを使ってます	417	2024-09-02 16:53:13.919
11	5	よい	330	2024-09-02 17:22:29.208
12	5		417	2024-09-02 17:29:52.753
13	4		344	2024-09-02 17:30:23.297
14	3		316	2024-09-02 17:40:03.042
15	4	へたれない	316	2024-09-02 17:40:24.686
16	5	結構丈夫で軽い	316	2024-09-02 17:41:01.223
17	5		316	2024-09-02 17:41:31.898
18	3		316	2024-09-02 17:41:41.023
19	5	名品	314	2024-09-02 17:50:01.961
20	5	名品	419	2024-09-02 18:08:52.177
21	5	ポンチョにもなり二役演じれます	419	2024-09-02 18:09:22.791
22	4	意外と安い	419	2024-09-02 18:09:33.909
24	5	めちゃめちゃいい	417	2024-09-06 17:52:43.141
25	5	お手軽で使いやすい\n収納もしやすい	422	2024-09-07 01:30:05.529
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: Trip; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Trip" (id, name, ptid, elevation, lat, lon, "userId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."User" (id, name, email, "emailVerified", password, image) FROM stdin;
cm0icvzm200001colna77gyde	Gaa Suu	fh6edpizf@gmail.com	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocLTxKzfWl5isA9hCVWTjSzh1fn0e-NvZeRe7DJ07cbgysb66g=s96-c
cm0m16nse0000zcm29dtdj0cy	テスター樋口1号	tantum.possumus.quantum.scimus@gmail.com	\N	$2b$10$zFN4mVhnefPbWEoUoVhFX.O6bsGmn3SOnEK3QCKN9XsB1DeoQvi2m	\N
cm0mmn51f0000tqtshufqtmu8	岡野拓海	rabbitfighter.okano@gmail.com	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocKb-gHbzCvTofblz416F0UIL_khaHaD4FS-Dxk1Gpqz7wIi-A=s96-c
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6721fdc9-6aac-4f96-9d07-86760eba12c2	79863c5a10564f1c54973048ac15c0148c6acb414ad4a453955a0a753486c9b0	2024-08-26 14:11:13.042584+00	20240822150516_init	\N	\N	2024-08-26 14:11:12.231875+00	1
fa580e01-eab1-46bf-84b6-685577daf13b	eeb8d401b48fcb5cd3037a05e977638de9e64f92ccaf8b0429e9f53395428101	2024-09-05 15:07:08.935597+00	20240905150707_my_gear_list	\N	\N	2024-09-05 15:07:08.111216+00	1
66f9e237-4187-4e11-86f3-c1b058c607a3	b80a63ef266c30dba291c89f8f7525deabcb63c49e99cfa38c0f0df726e48091	2024-08-26 14:11:14.162837+00	20240822154844_add_role_to_user	\N	\N	2024-08-26 14:11:13.362182+00	1
b6569d89-cb65-4f79-a249-705f362df3bc	273fcc307f836dc67c6e4fee424f6dcc4c8f9e80486513d9dfa15835b0274600	2024-08-26 14:11:15.282779+00	20240822155104_npx_prisma_generate	\N	\N	2024-08-26 14:11:14.482383+00	1
8c3e3c8c-d637-4f7f-8f83-9afcdf48b1d7	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2024-08-26 14:11:16.405039+00	20240822155722_add_new_column	\N	\N	2024-08-26 14:11:15.602214+00	1
78fe530c-3656-4564-874c-4743eb97f251	0357528e449d3f9f90248af9bbf695093ae986fc8b4ef1e9a2bc8fa1c84b284f	2024-09-05 16:07:00.943695+00	20240905160659_my_gear_list2	\N	\N	2024-09-05 16:07:00.127051+00	1
7950e320-2ce5-492c-b945-643310a4ee7b	1f434ad7b21b9731fb2c5e943e0f2c788a727f4c27c3adba0cf4705ac565a6b4	2024-08-26 14:11:17.52802+00	20240823070300_price_add2	\N	\N	2024-08-26 14:11:16.726554+00	1
e06708dc-a2e1-4955-a8a9-b694313c5b36	f3d1c0dacddfea7900474f062676ccd2c56a996a1401a0b6de7834684497e3d0	2024-08-26 14:11:18.647616+00	20240823075034_price_producturl2	\N	\N	2024-08-26 14:11:17.847643+00	1
9bc38753-bdce-4ad1-b2bb-a22384a6aa7a	018cd1d32258fda64f87f548e0003865a2c1971e34998c83f8ef105fa3b54a0a	2024-08-26 14:11:19.76686+00	20240826132839_added_gear_weight	\N	\N	2024-08-26 14:11:18.96717+00	1
463e0fa4-9b63-4309-b854-09e738a7869e	a084d6c8c9d77d4beaef91f8eeccfc5e52faecab3ead02c0edf98e57baf81ec8	2024-09-06 12:58:49.33772+00	20240906125847_gearid_with_personalgear	\N	\N	2024-09-06 12:58:48.53943+00	1
aa5c0124-4092-4190-802d-fcc45c8cbd3c	7bf18a1e4caf5158f89e695f9437bd531a6a7b5f1c0c5392dfbb5e564efa78c2	2024-08-26 14:11:20.891044+00	20240826140318_added_gearname_unique	\N	\N	2024-08-26 14:11:20.086955+00	1
610b79ae-2030-462f-916f-3dde02d786ad	7a1244aa122619cfa09406a205db64aa50527c45dce5df3ae3dd514c9cef3e42	2024-08-27 15:09:30.129182+00	20240827150928_packing_list_and_login	\N	\N	2024-08-27 15:09:29.244758+00	1
005f109b-cb75-4873-94b8-a6194840f02a	2f6d1389732f4e8e0add35e263347dbf040d24403b4b96cdfe5d144543f6b34c	2024-09-02 12:48:37.786834+00	20240902124712_add_brand_and_category_to_gear	\N	\N	2024-09-02 12:48:36.846341+00	1
609b924a-62c0-47f5-a4f6-8d617c03be99	11314f135c22f68754bc212373b729e4bf2d498db1a7dd92ab3fdeaee1eb5678	2024-09-06 13:10:28.010849+00	20240906131026_gearid_with_personalgear_number	\N	\N	2024-09-06 13:10:27.208538+00	1
7d6271ee-f6b5-4a3a-8c80-2c13754f7e86	a53835c86b4d53c63fa49f7e0449903eb5dc143146d7ef97fd23b48e8d2a5654	2024-09-02 12:50:12.021612+00	20240902125010_migration_category_brand	\N	\N	2024-09-02 12:50:11.212706+00	1
13a3d000-7c60-495b-ae46-7b3ccb9bc89a	84d2864989a67e33b53fa8a6c38f612e46a2b147d19f359bc1ed241819c6f431	2024-09-02 14:23:54.199818+00	20240902142352_add_cache_model	\N	\N	2024-09-02 14:23:53.381752+00	1
40519ce4-e880-45bf-9ca6-2caed0890996	35cab8c42bcb45a8883c1693a0bb49f7c7f42fafef30c69e3a2c810bb21d138a	2024-09-02 17:20:16.660171+00	20240902172015_add_avg_rating_and_review_count	\N	\N	2024-09-02 17:20:15.842977+00	1
73af9ed4-76b5-4fd7-8fc0-2bc39a4722fe	8d4f27d2972dc28422d00d92701d319f4cb24642f27124277133764a2e759810	2024-09-06 14:03:48.70736+00	20240906140346_packing_recipe_addpersonalgear	\N	\N	2024-09-06 14:03:47.801294+00	1
d6bfd42b-f7f1-46b7-9f9f-8e9138f7bc20	038d8f4eb337873345b26171085409962bbbf000e45ba474d14217ee2de00fb9	2024-09-06 14:10:36.793159+00	20240906141035_topersonal_gearid	\N	\N	2024-09-06 14:10:35.996899+00	1
13e1ae3d-bf9e-4ca7-8f13-675346061e8d	2be3d8ac96798ffa58ffe3dc5657e2d5d198e8a2f7f136862287ead7ed4667a5	2024-09-11 15:31:10.075499+00	20240911152547_packinglist_refactor	\N	\N	2024-09-11 15:31:09.220727+00	1
\.


--
-- Name: Brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."Brand_id_seq"', 86, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."Category_id_seq"', 21, true);


--
-- Name: Gear_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."Gear_id_seq"', 536, true);


--
-- Name: PackingListItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."PackingListItem_id_seq"', 1, false);


--
-- Name: PackingListLike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."PackingListLike_id_seq"', 1, false);


--
-- Name: PackingList_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."PackingList_id_seq"', 128, true);


--
-- Name: PersonalGear_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."PersonalGear_id_seq"', 66, true);


--
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."Review_id_seq"', 25, true);


--
-- Name: Trip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."Trip_id_seq"', 1, false);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: CacheEntry CacheEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."CacheEntry"
    ADD CONSTRAINT "CacheEntry_pkey" PRIMARY KEY (key);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Gear Gear_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Gear"
    ADD CONSTRAINT "Gear_pkey" PRIMARY KEY (id);


--
-- Name: PackingListItem PackingListItem_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListItem"
    ADD CONSTRAINT "PackingListItem_pkey" PRIMARY KEY (id);


--
-- Name: PackingListLike PackingListLike_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListLike"
    ADD CONSTRAINT "PackingListLike_pkey" PRIMARY KEY (id);


--
-- Name: PackingList PackingList_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingList"
    ADD CONSTRAINT "PackingList_pkey" PRIMARY KEY (id);


--
-- Name: PersonalGear PersonalGear_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PersonalGear"
    ADD CONSTRAINT "PersonalGear_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Trip Trip_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Brand_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Brand_name_key" ON public."Brand" USING btree (name);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Gear_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Gear_name_key" ON public."Gear" USING btree (name);


--
-- Name: PackingListLike_userId_packingListId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "PackingListLike_userId_packingListId_key" ON public."PackingListLike" USING btree ("userId", "packingListId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Review update_gear_avg_rating_trigger; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER update_gear_avg_rating_trigger AFTER INSERT OR DELETE OR UPDATE ON public."Review" FOR EACH ROW EXECUTE FUNCTION public.update_gear_avg_rating();


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Gear Gear_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Gear"
    ADD CONSTRAINT "Gear_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Gear Gear_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Gear"
    ADD CONSTRAINT "Gear_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PackingListItem PackingListItem_gearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListItem"
    ADD CONSTRAINT "PackingListItem_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES public."Gear"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PackingListItem PackingListItem_packingListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListItem"
    ADD CONSTRAINT "PackingListItem_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES public."PackingList"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PackingListItem PackingListItem_personalGearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListItem"
    ADD CONSTRAINT "PackingListItem_personalGearId_fkey" FOREIGN KEY ("personalGearId") REFERENCES public."PersonalGear"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PackingListLike PackingListLike_packingListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListLike"
    ADD CONSTRAINT "PackingListLike_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES public."PackingList"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PackingListLike PackingListLike_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingListLike"
    ADD CONSTRAINT "PackingListLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PackingList PackingList_tripId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingList"
    ADD CONSTRAINT "PackingList_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES public."Trip"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PackingList PackingList_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PackingList"
    ADD CONSTRAINT "PackingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PersonalGear PersonalGear_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PersonalGear"
    ADD CONSTRAINT "PersonalGear_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonalGear PersonalGear_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PersonalGear"
    ADD CONSTRAINT "PersonalGear_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_gearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES public."Gear"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Trip Trip_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: default
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

