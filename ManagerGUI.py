import tkinter as tk
import tkinter.font as font
from tkinter import messagebox as mb
import json

with open('maps.json') as inf:
    fetchedContent = inf.read()
    allMapJSON = json.loads(fetchedContent)
    inf.close()

def clear_fields():
    ent_mapName.delete(0,tk.END)
    ent_creator.delete(0,tk.END)
    ent_drive.delete(0,tk.END)
    ent_length.delete(0,tk.END)
    ent_map_name.delete(0,tk.END)
    ent_video.delete(0,tk.END)
    halloween_var.set(False)

def goto_home():
    clear_fields()
    frm_home.grid()
    frm_addMap.grid_remove()
    frm_mapName.grid_remove()
    frm_mapDeleted.grid_remove()

def goto_addMap():
    btn_info_ok['command'] = ok_addNewMap
    lbl_addMap_title['text'] = 'Add New Map'
    clear_fields()
    frm_home.grid_remove()
    frm_addMap.grid(row=1)
    frm_mapName.grid_remove()
    frm_mapDeleted.grid_remove()

def goto_mapName():
    clear_fields()
    frm_home.grid_remove()
    frm_addMap.grid_remove()
    frm_mapName.grid()
    frm_mapDeleted.grid_remove()

def goto_mapDeleted():
    clear_fields()
    frm_home.grid_remove()
    frm_addMap.grid_remove()
    frm_mapName.grid_remove()
    frm_mapDeleted.grid()

def embed(link):
	if '?t' in link: link = link.replace('?t', '?start')
	embeded = link.replace('watch?v=','embed/')
	if link == embeded: embeded = link.replace('youtu.be', 'youtube.com/embed')
	return embeded

def ok_addNewMap():
    validateInfo = True
    map_name = ent_map_name.get()
    creator = ent_creator.get()
    length = ent_length.get()
    drive = ent_drive.get()
    validateInfo = validateInfo and map_name and creator and length and drive
    ytlink = ent_video.get()

    if ytlink=='':
        embedyt = 'images/noVideo.png'
    else:
        embedyt = embed(ytlink)

    if validateInfo:
        newMapJSON = {
            'map': map_name,
            'creator': creator,
            'length': length,
            'video': embedyt,
            'drive': drive
        }

        if halloween_var.get(): newMapJSON['halloween'] = True

        allMapJSON.append(newMapJSON)

        clear_fields()
        
        mb.showinfo('Added a New Map', f'Successfully Added the Map, "{map_name}" to the JSON!')
        goto_home()
    else: mb.showerror('Invalid Map data', 'Please fill out all the required fields!')

def ok_mapNameUpdate():
    mapName = ent_mapName.get()
    if mapName:
        for singleMap in allMapJSON:
            if singleMap['map'].lower() == mapName.lower():
                goto_addMap()
                lbl_addMap_title['text'] = 'Update Map Info'
                
                ent_map_name.insert(0,singleMap['map'])
                ent_creator.insert(0, singleMap['creator'])
                ent_length.insert(0,singleMap['length'])
                ent_drive.insert(0,singleMap['drive'])
                ent_video.insert(0,singleMap['video'])
                if singleMap.get('halloween'): halloween_var.set(True)

                def ok_updateMapInfo():
                    validateInfo = True
                    map_name = ent_map_name.get()
                    creator = ent_creator.get()
                    length = ent_length.get()
                    drive = ent_drive.get()
                    validateInfo = validateInfo and map_name and creator and length and drive
                    ytlink = ent_video.get()
                    if ytlink=='':
                        embedyt = 'images/noVideo.png'
                    else:
                        embedyt = embed(ytlink)

                    if validateInfo:
                        singleMap['map'] = map_name
                        singleMap['creator'] = creator
                        singleMap['length'] = length
                        singleMap['drive'] = drive
                        singleMap['video'] = embedyt
                        if singleMap.get('halloween'): singleMap.pop('halloween')
                        if halloween_var.get(): singleMap['halloween'] = True
                        mb.showinfo('Updated a Map', f'Successfully Updated the Map, "{map_name}" in the JSON!')
                        goto_home()
                    else: mb.showerror('Invalid Map data', 'Please fill out all the required fields!')

                btn_info_ok['command'] = ok_updateMapInfo

                break
        else: mb.showerror('Unknown Map', f'Couldn\'t find the Map, "{mapName}" in the JSON!')
    else: mb.showerror('No Map Name', 'Please enter the Map Name!')

def ok_mapNameDelete():
    mapName = ent_mapName.get()
    if mapName:
        for i in range(len(allMapJSON)):
            if allMapJSON[i]['map'].lower() == mapName.lower():
                mapName = allMapJSON[i]['map']
                confirmDelete = mb.askyesno('Confirm Map Deletion', f'Are you sure you want to Delete the Map, "{mapName}"?')
                if confirmDelete:
                    allMapJSON.pop(i)
                    lbl_mapDeleted['text'] = f'"{mapName}" map\nhas been deleted successfully!'
                    goto_mapDeleted()
                else:
                    mb.showwarning('Cancelled', 'Cancelled Map Deletion!')
                    goto_home()                
                break
        else: mb.showerror('Unknown Map', f'Couldn\'t find the Map, "{mapName}" in the JSON!')
    else: mb.showerror('No Map Name', 'Please enter the Map Name!')


def update_map():
    goto_mapName()
    lbl_mapName_title['text'] = 'Update a Map'
    btn_mapName_ok['command'] = ok_mapNameUpdate

def delete_map():
    goto_mapName()
    lbl_mapName_title['text'] = 'Delete a Map'
    btn_mapName_ok['command'] = ok_mapNameDelete

def publishChanges():
    confirmPublish = mb.askyesno('Confirm Publish', 'Are you sure you want to publish the changes you\'ve made?')
    if confirmPublish:
        with open('maps.json','w') as outf:
            outf.write(json.dumps(allMapJSON, indent=4))
            outf.close()
        mb.showinfo('Changes Published', 'Successfully Published all the changes to the JSON file!\nClick "Ok" to quit the application.')
        window.destroy()
    else: mb.showwarning('Cancelled', 'Cancelled Publishing the Changes!')

window = tk.Tk()
window.title('JSON Manager')
window.columnconfigure(0, minsize=500)
window.rowconfigure(0,minsize=50)
window.rowconfigure(1, minsize=500)

fnt_home_btns = font.Font(family='Times New Roman', size=15)
fnt_publish = font.Font(family='Helvetica', size=16)
fnt_info_btns = font.Font(family='Helevetica', size=12, weight='bold')

lbl_title = tk.Label(window, text='JSON Manager', font = ('Helevetica',35,'bold','italic'))
lbl_title.grid(pady=(25,15))

frm_home = tk.Frame(window)
lbl_home = tk.Label(frm_home,text='HOME',font=('Times',25,'bold'))
lbl_home.grid(pady=20)
btn_add = tk.Button(frm_home,text='Add a New Map',width=15, height=2, font=fnt_home_btns, command=goto_addMap)
btn_add.grid(pady=10)
btn_update = tk.Button(frm_home,text='Update a Map',width=15, height=2, font=fnt_home_btns, command=update_map)
btn_update.grid(pady=10)
btn_delete = tk.Button(frm_home,text='Delete a Map',width=15, height=2, font=fnt_home_btns, command=delete_map)
btn_delete.grid(pady=10)
btn_publish = tk.Button(frm_home,text='Publish the Changes to JSON File', width=30, height=2, font=fnt_publish, command=publishChanges)
btn_publish.grid(pady=(30,50))


frm_addMap = tk.Frame(window)
frm_addMap.rowconfigure(0, minsize=50)
frm_addMap.rowconfigure(1,minsize=300)
lbl_addMap_title = tk.Label(frm_addMap, text='Add New Map', font=('Times',25,'bold'))
lbl_addMap_title.grid(sticky='n',pady=20)

frm_mapInfo = tk.Frame(frm_addMap)
frm_mapInfo.columnconfigure([0,1],minsize=100)
lbl_map_name = tk.Label(frm_mapInfo,text='Map Name *\t\t:',font=('Helevatica',11))
lbl_map_name.grid(row=0,column=0,sticky='w',pady=10)
ent_map_name = tk.Entry(frm_mapInfo,width=30,highlightbackground='grey',highlightthickness=1,font='Helevatica 11')
ent_map_name.grid(row=0,column=1)
lbl_creator = tk.Label(frm_mapInfo,text='Creator Name *\t\t:',font=('Helevatica',11))
lbl_creator.grid(row=1,column=0,sticky='w',pady=10)
ent_creator = tk.Entry(frm_mapInfo,width=30,highlightbackground='grey',highlightthickness=1,font='Helevatica 11')
ent_creator.grid(row=1,column=1)
lbl_length = tk.Label(frm_mapInfo,text='Map Length *\t\t:',font=('Helevatica',11))
lbl_length.grid(row=2,column=0,sticky='w',pady=10)
ent_length = tk.Entry(frm_mapInfo,width=30,highlightbackground='grey',highlightthickness=1,font='Helevatica 11')
ent_length.grid(row=2,column=1)
lbl_drive = tk.Label(frm_mapInfo,text='Google Drive Link *\t\t:',font=('Helevatica',11))
lbl_drive.grid(row=3,column=0,sticky='w',pady=10)
ent_drive = tk.Entry(frm_mapInfo,width=30,highlightbackground='grey',highlightthickness=1,font='Helevatica 11')
ent_drive.grid(row=3,column=1)
lbl_video = tk.Label(frm_mapInfo, text='Video Showcase\t\t:',font=('Helevatica',11))
lbl_video.grid(row=4,column=0,sticky='w',pady=10)
ent_video = tk.Entry(frm_mapInfo,width=30,highlightbackground='grey',highlightthickness=1,font='Helevatica 11')
ent_video.grid(row=4,column=1)
halloween_var = tk.BooleanVar()
chk_halloween = tk.Checkbutton(frm_mapInfo,text='Halloween Map',variable=halloween_var,onvalue=True,offvalue=False,font=('Helevatica',11))
chk_halloween.grid(row=5,column=1,sticky='w',pady=10)
frm_mapInfo.grid(pady=(0,15))

frm_infoBtns = tk.Frame(frm_addMap)
btn_cancel = tk.Button(frm_infoBtns,text='Cancel',width=10,height=2,font=fnt_info_btns,command=goto_home)
btn_cancel.grid(row=0,column=0,padx=15)
btn_info_ok = tk.Button(frm_infoBtns,text='OK',width=10, height=2,font=fnt_info_btns)
btn_info_ok.grid(row=0,column=1,padx=15)
frm_infoBtns.grid(pady=(0,20))


frm_mapName = tk.Frame(window)
frm_mapName.rowconfigure(0,minsize=50)
frm_mapName.rowconfigure(1,minsize=150)

lbl_mapName_title = tk.Label(frm_mapName,text='Update a Map', font=('Times',25,'bold'))
lbl_mapName_title.grid()

frm_mapName_content = tk.Frame(frm_mapName)
lbl_mapName = tk.Label(frm_mapName_content,text='Map Name    :',font=('Helevetica',15))
lbl_mapName.grid(row=0,column=0,padx=10)
ent_mapName = tk.Entry(frm_mapName_content,width=30,highlightbackground='grey',highlightthickness=1,font='Helevatica 13')
ent_mapName.grid(row=0,column=1,padx=10)
frm_mapName_content.grid()

frm_mapName_btns = tk.Frame(frm_mapName)
btn_mapName_cancel = tk.Button(frm_mapName_btns,text='Cancel',width=10,height=2,font=fnt_info_btns,command=goto_home)
btn_mapName_cancel.grid(row=0,column=0,padx=20)
btn_mapName_ok = tk.Button(frm_mapName_btns,text='OK',width=10,height=2,font=fnt_info_btns)
btn_mapName_ok.grid(row=0,column=1,padx=20)
frm_mapName_btns.grid()

frm_mapDeleted = tk.Frame(window)
lbl_delete_title = tk.Label(frm_mapDeleted,text='Deleted a Map',font=('Times',25,'bold'))
lbl_delete_title.grid(pady=20)
lbl_mapDeleted = tk.Label(frm_mapDeleted,font=('Helevetica',15))
lbl_mapDeleted.grid(pady=20)
btn_mapDeleted = tk.Button(frm_mapDeleted,text='Home',width=10,height=2,font=fnt_info_btns,command=goto_home)
btn_mapDeleted.grid(pady=20)


frm_home.grid()


window.eval('tk::PlaceWindow . center')
window.mainloop()