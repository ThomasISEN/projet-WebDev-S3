import { Pipe, PipeTransform } from '@angular/core';
import { Tache } from '../model/tache';

@Pipe({
  name: 'filtreTache'
})
export class FiltreTachePipe implements PipeTransform {

  transform(value: Array<Tache>, filter: string): Array<Tache> {
    if (!value) {
      return value;
    }
    switch (filter) {
      case "Undefined":
        return value.filter(tache => tache.statut == "Undefined");
      case "En Attente":
        return value.filter(tache => tache.statut == "En Attente");
      case "En Cours":
        return value.filter(tache => tache.statut == "En Cours");
      case "Termine":
        return value.filter(tache => tache.statut == "Termine");
      default:
        return value;
    }
  }
}
