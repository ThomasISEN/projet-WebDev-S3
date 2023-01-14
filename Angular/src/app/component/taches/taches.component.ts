import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tache, Liste } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {

  titreListe: string = "";
  startStatuts: Array<string> = [];
  startListe: Array<Liste> = [];

  constructor(private tacheService: TachesService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.tacheService.getTaches().subscribe({ 
      //récupérer les taches et leurs status
      next: (Liste) => {
        Liste.forEach((tache, index) => {
        
          if (index == 0) {
            this.startStatuts.push(tache.statut);
          }
          else {
            let i = 0;
            this.startStatuts.forEach(statut => { 
              if (tache.statut == statut) {
                i++;
              }
            });
            if (i == 0) {
              this.startStatuts.push(tache.statut);
            }
          }
        });


        this.startStatuts.forEach(statut => {
          // on récupère les taches pour chaque statut
          let newListe: Liste = { 
            titreListe: statut,
            titreTache: "",
            taches: []
          }

          this.tacheService.getTaches().subscribe({
            next: (Liste) => {
              
              let ListeFiltred = Liste.filter(tache => tache.statut == statut);
              newListe.taches = ListeFiltred;
              this.startListe.push(newListe);
            }
          });
        });
      }
    });
  }

  ajouterTache(Liste: Liste) {
    //création des taches quand elles sont ajoutées
    let newTache: Tache = { 
      titre: Liste.titreTache,
      termine: false,
      statut: Liste.titreListe
    };
    this.tacheService.ajoutTaches(newTache).subscribe({
      next: (data) => {
        this.startListe.forEach(liste => {
          if (liste.titreListe == Liste.titreListe) {
            liste.taches.push(data);
          }
        })
      }
    });
  }

  supprimerTache(Liste: Liste, tache: Tache) {
    //Suppression de la tache (quand on appuie sur le bouton, partie html)
    this.tacheService.removeTaches(tache).subscribe({
      next: () => {
        Liste.taches = Liste.taches.filter(Ltmp => tache._id != Ltmp._id);
      }
    });
  }

  modifier(tache: Tache) {
    //changement du status; terminé ou non
    tache.termine = !tache.termine;
    this.tacheService.updateTaches(tache).subscribe({});
  }
  loggout() {
    //la déconnexion par le boutton
    this.userService.logout().subscribe(() => {
      this.router.navigate(['']);
    })
  }

  drop(event: CdkDragDrop<Array<Tache>>) {
    //le drop est utilisé pour le transfert entre colonnes des taches
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    event.item.data.statut = event.container.data[0].statut;
    this.tacheService.updateTaches(event.item.data).subscribe({});
  }

  ajouterListe() {
    let newListe: Liste = {
      titreListe: "",
      titreTache: "",
      taches: []
    }

    let listeExisteDeja = this.startListe.filter(liste => liste.titreListe == this.titreListe);
    if (listeExisteDeja.length == 0) { //on regarde si la liste qu'on veut créer n'existe pas déjà 
      this.tacheService.getTaches().subscribe({
        next: (Liste) => {
          let nouvTache: Tache = { 
            titre: "exemple",
            termine: false,
            statut: this.titreListe
          };
          let ListeFiltred = Liste.filter(tache => tache.statut == this.titreListe);//on ajoute les taches assigné à ce titre dans la liste 
          newListe.taches = [nouvTache];
          newListe.titreListe = this.titreListe;
          if (ListeFiltred.length == 0) { //
            this.startListe.push(newListe);
      
          }
        }
      });
    }
  }

  supprimerListe(Liste: Liste) {
    Liste.taches.forEach((tache: Tache) => {
      this.tacheService.removeTaches(tache).subscribe({});
    });
    this.startListe = this.startListe.filter(liste => liste.titreListe != Liste.titreListe);
  }

}