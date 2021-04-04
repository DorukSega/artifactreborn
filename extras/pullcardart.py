# I hate python
from PIL import Image 
import PIL
import json
f = open('cards.json',)
data= json.load(f)
ids = []
for item in data['cards']:
    if item["type"]=="hero":
        id=item['id']
        firstfullart="artifactcards/full_art/"+str(id)+"_psd"+".png"
        finalfullartname="notcropped/full_art/"+str(id)+".png"
        firstheroicon="artifactcards/hero_icons/"+str(id)+"_png"+".png"
        finaltheroicon="notcropped/hero_icons/"+str(id)+".png"
        firstminiicons="artifactcards/mini_icons/"+str(id)+"_psd"+".png"
        finalminiicons="notcropped/mini_icons/"+str(id)+".png"
        im = Image.open(firstfullart)
        im =im.save(finalfullartname)
        im = Image.open(firstheroicon)
        im =im.save(finaltheroicon)
        im = Image.open(firstminiicons)
        im =im.save(finalminiicons)
    else:
        id=item['id']
        firstfullart="artifactcards/full_art/"+str(id)+"_psd"+".png"
        finalfullartname="notcropped/full_art/"+str(id)+".png"
        firstminiicons="artifactcards/mini_icons/"+str(id)+"_psd"+".png"
        finalminiicons="notcropped/mini_icons/"+str(id)+".png"
        im = Image.open(firstfullart)
        im =im.save(finalfullartname)
        im = Image.open(firstminiicons)
        im =im.save(finalminiicons)