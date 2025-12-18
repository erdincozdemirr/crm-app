--
-- PostgreSQL database dump
--

\restrict 33nnKeTZJXVZqiLApsXi9saefj2n0NnvXjpuYfiRfht7wrNGHDGQc5FMLVZ4T1Q

-- Dumped from database version 14.20
-- Dumped by pg_dump version 14.20

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
-- Name: enum_orders_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_orders_status AS ENUM (
    'PENDING',
    'PREPARING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public.enum_orders_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: SystemLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemLogs" (
    id integer NOT NULL,
    level character varying(255) NOT NULL,
    message text NOT NULL,
    meta jsonb,
    "traceId" character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SystemLogs" OWNER TO postgres;

--
-- Name: SystemLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SystemLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SystemLogs_id_seq" OWNER TO postgres;

--
-- Name: SystemLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SystemLogs_id_seq" OWNED BY public."SystemLogs".id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255),
    phone character varying(255),
    email character varying(255),
    address text,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: etl_imports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etl_imports (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    file_content bytea NOT NULL,
    status character varying(255) DEFAULT 'PENDING'::character varying,
    processed_count integer DEFAULT 0,
    error_count integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.etl_imports OWNER TO postgres;

--
-- Name: etl_imports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.etl_imports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.etl_imports_id_seq OWNER TO postgres;

--
-- Name: etl_imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etl_imports_id_seq OWNED BY public.etl_imports.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    status public.enum_orders_status DEFAULT 'PENDING'::public.enum_orders_status NOT NULL,
    total_price numeric(10,2) DEFAULT 0 NOT NULL,
    shipping_address text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    sku character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    stock_quantity integer DEFAULT 0 NOT NULL,
    is_stock_tracked boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: SystemLogs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemLogs" ALTER COLUMN id SET DEFAULT nextval('public."SystemLogs_id_seq"'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: etl_imports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etl_imports ALTER COLUMN id SET DEFAULT nextval('public.etl_imports_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
01-create-customer.js
02-create-product.js
03-create-order.js
04-create-order-items.js
05-create-etl-imports.js
06-create-system-logs.js
\.


--
-- Data for Name: SystemLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemLogs" (id, level, message, meta, "traceId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, first_name, last_name, phone, email, address, notes, created_at, updated_at) FROM stdin;
1	Test	User	+905551112233	\N	\N	\N	2025-12-18 03:40:22.862+00	2025-12-18 03:40:22.862+00
2	Ahmet	Yılmaz	5551112233	ahmet@example.com	\N	Sadık müşteri	2025-12-18 03:48:48.153+00	2025-12-18 03:48:48.153+00
3	Ayşe	Demir	5554445566	ayse@example.com	\N	Yeni kayıt	2025-12-18 03:48:48.154+00	2025-12-18 03:48:48.154+00
4	Mehmet	Kaya	5557778899	mehmet@example.com	\N	Kurumsal	2025-12-18 03:48:48.155+00	2025-12-18 03:48:48.155+00
5	Zeynep	Çelik	5550001122	zeynep@example.com	\N		2025-12-18 03:48:48.155+00	2025-12-18 03:48:48.155+00
6	Ali	Vural	5559998877	ali@example.com	\N	Ödeme sorunu yaşadı	2025-12-18 03:48:48.156+00	2025-12-18 03:48:48.156+00
\.


--
-- Data for Name: etl_imports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etl_imports (id, filename, file_content, status, processed_count, error_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, customer_id, status, total_price, shipping_address, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, sku, price, stock_quantity, is_stock_tracked, created_at, updated_at) FROM stdin;
1	Laptop Pro X1	LP-001	25000.00	15	t	2025-12-18 03:48:48.099+00	2025-12-18 03:48:48.099+00
2	Kablosuz Mouse	MS-002	450.00	50	t	2025-12-18 03:48:48.143+00	2025-12-18 03:48:48.143+00
3	Mekanik Klavye	KB-003	1200.00	30	t	2025-12-18 03:48:48.145+00	2025-12-18 03:48:48.145+00
4	27" 4K Monitör	MN-004	8500.00	10	t	2025-12-18 03:48:48.145+00	2025-12-18 03:48:48.145+00
5	USB-C Hub	HB-005	300.00	100	t	2025-12-18 03:48:48.147+00	2025-12-18 03:48:48.147+00
6	Gaming Kulaklık	HS-006	1500.00	25	t	2025-12-18 03:48:48.148+00	2025-12-18 03:48:48.148+00
7	Webcam 1080p	WC-007	900.00	40	t	2025-12-18 03:48:48.149+00	2025-12-18 03:48:48.149+00
8	Ergonomik Koltuk	CH-008	5500.00	5	t	2025-12-18 03:48:48.15+00	2025-12-18 03:48:48.15+00
9	Akıllı Saat	SW-009	3200.00	20	t	2025-12-18 03:48:48.151+00	2025-12-18 03:48:48.151+00
10	Tablet 10"	TB-010	4500.00	12	t	2025-12-18 03:48:48.152+00	2025-12-18 03:48:48.152+00
\.


--
-- Name: SystemLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SystemLogs_id_seq"', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 6, true);


--
-- Name: etl_imports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etl_imports_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 10, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: SystemLogs SystemLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemLogs"
    ADD CONSTRAINT "SystemLogs_pkey" PRIMARY KEY (id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key UNIQUE (phone);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: etl_imports etl_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etl_imports
    ADD CONSTRAINT etl_imports_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: system_logs_trace_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_logs_trace_id ON public."SystemLogs" USING btree ("traceId");


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 33nnKeTZJXVZqiLApsXi9saefj2n0NnvXjpuYfiRfht7wrNGHDGQc5FMLVZ4T1Q

