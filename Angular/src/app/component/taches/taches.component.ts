import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tache } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {

  tachesUndefined: Array<Tache> = [];
  tachesEnAttente: Array<Tache> = [];
  tachesEnCours: Array<Tache> = [];
  tachesTermine: Array<Tache> = [];

  nouvTacheUndefined: Tache = {
    titre: '',
    termine: false,
    statut: "Undefined"
  };
  nouvTacheEnAttente: Tache = {
    titre: '',
    termine: false,
    statut: "En Attente"
  };
  nouvTacheEnCours: Tache = {
    titre: '',
    termine: false,
    statut: "En Cours"
  };
  nouvTacheTermine: Tache = {
    titre: '',
    termine: false,
    statut: "Termine"
  };


  constructor(private tacheService: TachesService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.tacheService.getTaches().subscribe({
      next: (data: Array<Tache>) => {
        data.forEach(tache => {
          switch (tache.statut) {
            case "Undefined":
              this.tachesUndefined.push(tache);
              break;
            case "En Attente":
              this.tachesEnAttente.push(tache);
              break;
            case "En Cours":
              this.tachesEnCours.push(tache);
              break;
            case "Termine":
              this.tachesTermine.push(tache);
              break;
            default:
              console.log(tache.statut);
              console.log("!!!! switch case init status taches.component.ts !!!!");
              break;
          }
        });
      }
    });
  }

  ajouterUndefined() {
    this.tacheService.ajoutTaches(this.nouvTacheUndefined).subscribe({
      next: (data) => {
        this.tachesUndefined.push(data);
      }
    });
  }
  ajouterEnAttente() {
    this.tacheService.ajoutTaches(this.nouvTacheEnAttente).subscribe({
      next: (data) => {
        this.tachesEnAttente.push(data);
      }
    });
  }
  ajouterEnCours() {
    this.tacheService.ajoutTaches(this.nouvTacheEnCours).subscribe({
      next: (data) => {
        this.tachesEnCours.push(data);
      }
    });
  }
  ajouterTermine() {
    this.tacheService.ajoutTaches(this.nouvTacheTermine).subscribe({
      next: (data) => {
        this.tachesTermine.push(data);
      }
    });
  }

  supprimer(tache: Tache) {
    this.tacheService.removeTaches(tache).subscribe({
      next: (data) => {
        this.tachesUndefined = this.tachesUndefined.filter(e => tache._id != e._id);
        this.tachesEnAttente = this.tachesEnAttente.filter(e => tache._id != e._id);
        this.tachesEnCours = this.tachesEnCours.filter(e => tache._id != e._id);
        this.tachesTermine = this.tachesTermine.filter(e => tache._id != e._id);
      }
    });
  }

  modifier(tache: Tache) {
    tache.termine = !tache.termine;
    this.tacheService.updateTaches(tache).subscribe({
      next: (data) => {
      }
    });
  }

  loggout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['']);
    })
  }
  drop(event: CdkDragDrop<Array<Tache>>) {
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
    switch (event.container.data) {
      case this.tachesUndefined:
        event.item.data.statut = "Undefined";
        break;
      case this.tachesEnAttente:
        event.item.data.statut = "En Attente";
        break;
      case this.tachesEnCours:
        event.item.data.statut = "En Cours";
        break;
      case this.tachesTermine:
        event.item.data.statut = "Termine";
        break;
      default:
        console.log("!!! drag and drop switch case taches.component.ts !!!");
        break;
    }
    this.tacheService.updateTaches(event.item.data).subscribe({});
  }
}
