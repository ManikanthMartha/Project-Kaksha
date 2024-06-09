#!/usr/bin/env python
# coding: utf-8

# In[24]:


# def extract_text_from_pdf(pdf_path):
    # from sumy.parsers.plaintext import PlaintextParser
#     from sumy.nlp.tokenizers import Tokenizer
#     from sumy.summarizers.lsa import LsaSummarizer
#     import fitz  
#     pdf_document = fitz.open(pdf_path)
#     text = ""
#     for page_num in range(len(pdf_document)):
#         page = pdf_document.load_page(page_num)
#         text += page.get_text()
#     return text

from flask import jsonify


def summarizer(pdf_path):
    import PyPDF2
    import requests
    import io

    from sumy.parsers.plaintext import PlaintextParser
    from sumy.nlp.tokenizers import Tokenizer
    from sumy.summarizers.lsa import LsaSummarizer
    url = pdf_path
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Windows; Windows x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36'}
    response = requests.get(url=url, headers=headers, timeout=120)
    on_fly_mem_obj = io.BytesIO(response.content)
    pdf_reader = PyPDF2.PdfReader(on_fly_mem_obj)
    # pdf_reader = PyPDF2.PdfReader(pdf_path)
    text = ''
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    # text = extract_text_from_pdf(pdf_path)
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, 10) 
    summary_sentences = [str(sentence) for sentence in summary]

    return summary_sentences

# url = 'https://dzylziennabbwterlnwj.supabase.co/storage/v1/object/sign/pdfs/original_DS_labmaual_detailed_2023August.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwZGZzL29yaWdpbmFsX0RTX2xhYm1hdWFsX2RldGFpbGVkXzIwMjNBdWd1c3QucGRmIiwiaWF0IjoxNzE3NTE1ODU0LCJleHAiOjE3MTgxMjA2NTR9.idqCtkHy79YfcSRbU0jodQJoA8-t296j8IcEqjb9pD4&t=2024-06-04T15%3A44%3A14.186Z'

# summary = summarizer(url)
# for sentence in summary:
#         print(sentence)


# In[ ]:




